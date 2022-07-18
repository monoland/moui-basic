import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
    state: () => ({
        collections: [],
        combos: {},
        currentRecord: {},
        currentRoute: {},

        dialog: {
            delete: false
        },

        drawer: {
            mini: false,
            state: true
        },

        features: [],
        filter: {
            data: {},
            state: false,
        },
        footer: { 
            'disable-items-per-page': false, 
            'items-per-page-options': [10, 25, 50, 100, 250] 
        },

        headers: [],

        initialized: false,
        
        links: {},
        loading: {
            icon: 'cloud_sync',
            message: null,
            state: false,
        },

        options: {
            page: 1,
            itemsPerPage: process.env.VUE_APP_PAGE_ITEMPERPAGE,
            sortBy: [],
            sortDesc: []
        },

        page: 'dashboard',
        pagingCurrent: 0,
        pagingLast: 0,

        recordBase: {},
        recordKey: null,
        recordsTotal: 0,

        selected: [],
        selected_index: -1,
        search: {
            items: [],
            findBy: null,
            findOn: null,
            status: false
        },
        snackbar: {
            color: null,
            state: false,
            text: null,
        },

        theme: 'blue-grey'
    }),

    getters: {
        dataURL() {
            let path = `/api/${this.page}`;

            if (this.currentRoute && 'path' in this.currentRoute) {
                path = this.currentRoute.path.indexOf('/create') !== -1 ? this.currentRoute.path.substring(0, this.currentRoute.path.indexOf('/create')) : this.currentRoute.path;
                path = path.indexOf('/show') !== -1 ? path.substring(0, path.indexOf('/show')) : path;
                path = path.indexOf('/edit') !== -1 ? path.substring(0, path.indexOf('/edit')) : path;
                path = path.replace(process.env.VUE_APP_SLUG, 'api');
            }

            return path;
        },

        hasSelected: (state) => {
            return Array.isArray(state.selected) ? state.selected.length > 0 : state.selected
        },

        pageFilters: (state) => {
            let results = Object.keys(state.filter.data)
                .filter(key => state.filter.data[key].value !== null)
                .reduce((carry, key) => {
                    if (typeof carry === 'undefined') {
                        carry = [];
                    }

                    if (state.filter.data[key].operator === null) {
                        return carry;
                    }

                    let filterValue = typeof state.filter.data[key].value === 'object' ? 
                        state.filter.data[key].value.value : 
                        state.filter.data[key].value;

                    carry.push(
                        key + ';' + 
                        state.filter.data[key].operator + ';' + 
                        filterValue
                    );

                    return carry;
                }, []);

            if (results && Array.isArray(results) && results.length >= 1) {
                return results.join('+');
            }

            return [];
        },

        pageParams: (state) => {
            let params = {
                initialized: state.initialized === false ? true : null,
                itemsPerPage: state.options.itemsPerPage,
                page: state.options.page,
                sortBy: Array.isArray(state.options.sortBy) && 
                    state.options.sortBy.length > 0 ? 
                    state.options.sortBy[0] : null,
                sortDesc: Array.isArray(state.options.sortDesc) && 
                    state.options.sortDesc.length > 0 ? 
                    state.options.sortDesc[0] : null,
                findBy: state.search.findBy
            };

            return Object.keys(params)
                .filter(key => params[key] !== null)
                .reduce((carry, key) => {
                    if (typeof carry === 'undefined') {
                        carry = {};
                    }
                    
                    carry[key] = params[key];

                    return carry;
                }, {});
        },
    },

    actions: {
        fetchPageRecords({ filterMode }) {
            this.loading.state = true;

            this.$http(this.dataURL, {
                method: 'GET',
                params: this.pageFilters.length > 0 ? 
                    { ...this.pageParams, filters: this.pageFilters } : 
                    this.pageParams,
            })
            .then(({ data, meta, setups }) => {
                this.selected = [];

                this.currentRecord = {};

                if (this.initialized !== true || filterMode) {
                    this.collections = data;
                } else {
                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(record => {
                            this.collections.push(record);
                        });
                    } else {
                        this.collections = [];
                    }
                }

                if (filterMode) {
                    this.filter.state = false;
                }

                if (meta && 'total' in meta) {
                    this.pagingCurrent = meta.current_page;
                    this.pagingLast = meta.last_page;
                    this.recordsTotal = meta.total;
                }

                if (setups && 'headers' in setups) {
                    this.headers = setups.headers;
                    this.recordKey = setups.key;
                    this.recordBase = setups.record_base;

                    this.combos = Array.isArray(setups.combos) ? {} : setups.combos;
                    
                    Object.keys(setups.features).forEach(key => {
                        let _index = this.features.indexOf(key);
        
                        if (_index !== -1) {
                            this.features.splice(_index, 1);
                        }
        
                        if (setups.features[key] === true) {
                            this.features.push(key)
                        }
                    });

                    // page filters
                    if (Object.keys(this.filter.data).length <= 0) {
                        this.filter.data = setups.filters;
                    }
                    
                    this.search.items = setups.finds;
                    this.title = setups.title;

                    this.$storage.setItem('page-setups', {
                        combos: this.combos,
                        recordKey: this.recordKey,
                        recordBase: this.recordBase,
                    });
                }

                if (!this.initialized) {
                    this.initialized = true;
                    this.record = JSON.parse(JSON.stringify(this.recordBase));
                }

                this.loading.state = false;
                this.status = 200;
            })
            .catch((e) => {
                this.loading.state = false;
                this.recordErrorHandler(e);
            });
        },

        fetchSingleRecord(paramKey, callback) {
            if (!paramKey) {
                return;
            }

            this.$http(this.dataURL, {
                method: 'GET'
            })
            .then(({ features, record, setups, links }) => {
                if (!record) {
                    return;
                }

                this.currentRecord = record;

                Object.keys(features).forEach(key => {
                    let _index = this.features.indexOf(key);
    
                    if (_index !== -1) {
                        this.features.splice(_index, 1);
                    }
    
                    if (features[key] === true) {
                        this.features.push(key)
                    }
                });

                if (setups && 'combos' in setups) {
                    this.combos = setups.combos;
                }

                if (links) {
                    this.links = Array.isArray(links) ? {} : links;
                }

                if (typeof callback === 'function') {
                    callback({ features, record, setups, links });
                }
            })
            .catch((e) => {
                this.recordErrorHandler(e);
            });
        },

        setSelected(selected) {
            this.selected = selected;
            this.currentRecord = selected && selected.length ? selected[0] : {};
        },

        recordErrorHandler(e, callback) {
            if (e.status === 401) {
                this.$storage.clear().then(() => {
                    window.location.replace('/');
                });

                return;
            }

            this.status = e.status;

            this.$snackbar({
                color: 'error',
                text: e.status === 404 ? 'alamat tidak ditemukan pada server.' : e.message
            });

            if (typeof callback === 'function') {
                callback();
            }
        },
    }
});