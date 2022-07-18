<?php

namespace App\Traits;

use ReflectionMethod;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use App\Attributes\SearchUsingPrefix;
use App\Attributes\SearchUsingFullText;
use Illuminate\Database\Eloquent\Builder;

trait Searchable
{
    /**
     * Undocumented function
     *
     * @param Builder $query
     * @param [type] $mode
     * @return Builder
     */
    public function scopeApplyMode(Builder $query, $mode): Builder
    {
        if ($mode === 'trashed') {
            return $query->onlyTrashed();
        }

        return $query;
    }

    /**
     * Undocumented function
     *
     * @param Builder $query
     * @param [type] $sortBy
     * @param boolean $sortDesc
     * @return Builder
     */
    public function scopeSortBy(Builder $query, $sortBy = null, $sortAz = false): Builder
    {
        $sortBy = $sortBy ? strtolower($sortBy) : null;
        $sortAz = $sortAz === 'true' ? 'desc' : 'asc';

        if ($sortBy) {
            $query = $query->orderBy($sortBy, $sortAz);
        } else {
            $query = $query->orderBy($this->defaultOrder, $sortAz);
        }

        if (method_exists($this, 'scopeAlterOrderBy')) {
            $this->scopeAlterOrderBy($query);
        }

        return $query;
    }

    /**
     * Undocumented function
     *
     * @param Builder $builder
     * @param [type] $search
     * @return Builder
     */
    public function scopeSearch(Builder $builder, $search): Builder
    {
        $columns = $this->toSearchableArray();
        $prefixColumns = $this->getPrefixColumns($builder);
        $fullTextColumns = $this->getFullTextColumns($builder);

        if (!$search || count($columns) <= 0) {
            return $builder;
        }

        if (method_exists($this, 'scopeAlterSelect')) {
            $this->scopeAlterSelect($builder);
        }

        return $builder->where(function ($query) use ($search, $columns, $prefixColumns, $fullTextColumns) {
            $connectionType = $this->getConnection()->getDriverName();

            $canSearchPrimaryKey = ctype_digit($search) &&
                in_array($this->getKeyType(), ['int', 'integer']) &&
                ($connectionType != 'pgsql' || $search <= PHP_INT_MAX) &&
                array_key_exists($this->getKeyName(), $columns);

            if ($canSearchPrimaryKey) {
                $query->orWhere($this->getQualifiedKeyName(), $search);
            }

            foreach ($columns as $key => $column) {
                if (in_array($column, $fullTextColumns)) {
                    $query->orWhereFullText(
                        $this->qualifyColumn($column),
                        $search
                    );
                } else {
                    if ($canSearchPrimaryKey && $column === $this->getKeyName()) {
                        continue;
                    }

                    $query->orWhere(
                        $this->qualifyColumn($column),
                        'ilike',
                        in_array($column, $prefixColumns) ? $search . '%' : '%' . $search . '%',
                    );
                }
            }
        });
    }

    /**
     * Undocumented function
     *
     * @param Builder $builder
     * @return array
     */
    protected function getPrefixColumns(Builder $builder): array
    {
        return $this->getSearchAttributeColumns($builder, SearchUsingPrefix::class);
    }

    /**
     * Undocumented function
     *
     * @param Builder $builder
     * @return array
     */
    protected function getFullTextColumns(Builder $builder): array
    {
        return $this->getSearchAttributeColumns($builder, SearchUsingFullText::class);
    }

    /**
     * Undocumented function
     *
     * @param Builder $builder
     * @param [type] $attributeClass
     * @return array
     */
    protected function getSearchAttributeColumns(Builder $builder, $attributeClass): array
    {
        $columns = [];

        if (PHP_MAJOR_VERSION < 8) {
            return [];
        }

        foreach ((new ReflectionMethod($this, 'toSearchableArray'))->getAttributes() as $attribute) {
            if ($attribute->getName() !== $attributeClass) {
                continue;
            }

            $columns = array_merge($columns, Arr::wrap($attribute->getArguments()[0]));
        }

        return $columns;
    }
}
