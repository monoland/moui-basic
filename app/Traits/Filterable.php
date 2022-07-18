<?php

namespace App\Traits;

use ReflectionMethod;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Attributes\FilterUsingAge;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeFilter(Builder $query, $filters)
    {
        $filterableArray = $this->toFilterableArray();
        $carbonAgeColumns = $this->getFilterAgeColumn($query);
        $filterableParams = $this->toFilterableParams();

        if (count($filterableArray) <= 0) {
            return $query;
        }

        if (method_exists($this, 'toFilterableScope')) {
            $query = $this->toFilterableScope($query);
        }

        $filters = explode('+', $filters);

        foreach ($filters as $filter) {
            if (!str($filter)->contains(';')) {
                break;
            }

            list($key, $operator, $value) = explode(';', $filter);

            if (
                array_key_exists($key, $filterableParams) &&
                array_key_exists($key, $filterableArray) &&
                in_array($operator, $filterableParams[$key]['operators'])
            ) {
                if (in_array($key, $carbonAgeColumns)) {
                    $query = $query->whereRaw(
                        'EXTRACT(YEAR from AGE(NOW(), ' . $this->qualifyColumn($filterableArray[$key]) . ')) ' . $operator . ' ?',
                        [$value]
                    );
                } else {
                    if (str($filterableArray[$key])->contains('raw::')) {
                        $query = $query->whereRaw(
                            str($filterableArray[$key])->after('raw::') . ' ' . $operator . ' ?',
                            [$value]
                        );
                    } else {
                        $query = $query->where(
                            $this->qualifyColumn($filterableArray[$key]),
                            $operator,
                            $value
                        );
                    }
                }
            }
        }

        return $query;
    }

    /**
     * Undocumented function
     *
     * @param Builder $builder
     * @return array
     */
    protected function getFilterAgeColumn(Builder $builder): array
    {
        return $this->getFilterAttributeColumns($builder, FilterUsingAge::class);
    }

    /**
     * Undocumented function
     *
     * @param Builder $builder
     * @param [type] $attributeClass
     * @return array
     */
    protected function getFilterAttributeColumns(Builder $builder, $attributeClass): array
    {
        $columns = [];

        if (PHP_MAJOR_VERSION < 8) {
            return [];
        }

        foreach ((new ReflectionMethod($this, 'toFilterableArray'))->getAttributes() as $attribute) {
            if ($attribute->getName() !== $attributeClass) {
                continue;
            }

            $columns = array_merge($columns, Arr::wrap($attribute->getArguments()[0]));
        }

        return $columns;
    }

    /**
     * scope for data-filter
     *
     * @param Builder $query
     * @param Request $request
     * @return void
     */
    public function scopeFilterOn(Builder $query, Request $request)
    {
        $sortBy = strtolower($request->sortBy) ?: null;
        $sortAz = $request->sortDesc ? 'desc' : 'asc';
        $findBy = strtolower($request->findBy) ?: null;
        $findOn = $request->findOn ?: null;

        $trashed = $request->mode === 'trashed' ?: false;
        $filterOn = $request->filterOn ?: [];
        $filterBy = $request->filterBy ?: [];
        $filterOp = $request->filterOp ?: [];

        $mquery = $query;

        if ($trashed) {
            $mquery = $mquery->onlyTrashed();
        }

        if ($findOn) {
            $mquery = $mquery->whereRaw("LOWER({$findOn}) LIKE ?", ["%{$findBy}%"]);
        }

        foreach ($filterOp as $i => $operation) {
            if (!in_array($filterOn[$i], $this->filters) || !in_array($operation, $this->operations)) {
                continue;
            }

            if ($operation === '*') {
                $mquery = $mquery->whereRaw("{$filterOn[$i]} LIKE ?", ["%{$filterBy[$i]}%"]);
            } else {
                $mquery = $mquery->whereRaw("{$filterOn[$i]} {$operation} ?", ["{$filterBy[$i]}"]);
            }
        }

        if ($sortBy) {
            $mquery = $mquery->orderBy($sortBy, $sortAz);
        } else {
            $mquery = $mquery->orderBy($this->defaultOrder, $sortAz);
        }

        return $mquery;
    }
}
