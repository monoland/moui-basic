<template>
    <v-card :color="`${theme} darken-2`" flat tile height="100%">
        <v-toolbar 
            class="relative rounded-t-lg"
            :color="hasSelected ? `${theme}` : ``"
            :dark="hasSelected"
            flat
        >
            <v-btn v-if="!hasSelected"
                icon
                @click="navigateToParent()"
            >
                <v-icon>arrow_back</v-icon>
            </v-btn>

            <v-btn v-else
                icon
                @click="clearSelected"
            >
                <v-icon>close</v-icon>
            </v-btn>

            <v-toolbar-title>
                {{ hasSelected ? `${selected.length} data terpilih` : `${title}` }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-scale-transition origin="center center 0">
                <div v-if="!hasSelected"
                    key="toolbar_default"
                    class="absolute absolute--right d-flex align-center"
                    style="height: 64px; margin-right: 52px;"
                >
                    <slot name="toolbar_default" :store="systemStore"></slot>
                </div>

                <div v-else
                    key="toolbar_selected"
                    class="absolute absolute--right d-flex align-center"
                    style="height: 64px; margin-right: 52px;"
                >
                    <slot name="toolbar_selected" :store="systemStore"></slot>

                    <moui-button
                        icon="folder_open"
                        tooltip="Lihat Data"
                        @click="openFormShow"
                    ></moui-button>
                </div>
            </v-scale-transition>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                        v-bind="attrs"
                        v-on="on"
                        icon 
                        @click="filter.state = !filter.state"
                        :disabled="hasSelected"
                    >
                        <v-scale-transition>
                            <v-icon v-if="filter.state === false">filter_alt</v-icon>
                            <v-icon v-else>filter_alt_off</v-icon>
                        </v-scale-transition>
                    </v-btn>
                </template>

                <span>{{ filter.state ? 'Tutup' : 'Buka' }} Filter</span>
            </v-tooltip>
        </v-toolbar>

        <v-sheet
            :class="`rounded-b-lg`"
            height="calc(100vh - 72px)"
        >
            <moui-filter></moui-filter>

            <v-responsive
                :class="`relative overflow-hidden z-index-0 rounded-b-lg`"
                height="calc(100vh - 72px)"
                :content-class="`d-flex flex-column ${theme} lighten-4`"
            >
                <slot :store="systemStore" :theme="theme"></slot>
            </v-responsive>

            <v-fab-transition v-if="!disableAdd">
                <v-btn
                    v-if="!hasSelected"
                    :color="highlight"
                    key="index"
                    absolute
                    fab dark
                    large
                    style="bottom: 27px; right: 27px;"
                    @click="navigateToRouteCreate"
                >
                    <v-icon>add</v-icon>
                </v-btn>
            </v-fab-transition>
        </v-sheet>
    </v-card>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'page-data',

    props: {
        disableAdd: {
            type: Boolean,
            default: false
        },

        highlight: {
            type: String,
            default: 'deep-orange'
        },

        parent: {
            type: String,
            default: null
        },

        parentKey: {
            type: String,
            default: null
        },

        slug: {
            type: String,
            default: null
        },

        title: {
            type: String,
            default: 'Untitled'
        },

        withHeaderSlot: {
            type: Boolean,
            default: false
        },
    },

    setup() {
        const systemStore = useSystemStore();
        
        let { currentPage, drawer, filter, features, mode, module, currentRecord, hasSelected, selected, theme } = storeToRefs(systemStore);

        return { 
            systemStore,
            drawer, filter, features, hasSelected, mode, module, currentPage, currentRecord, selected, theme 
        };
    },

    created() {
        this.systemStore.$patch(state => {
            state.page = this.slug;
            state.currentRoute = this.$route;
        });
    },

    mounted() {
        this.systemStore.fetchPageRecords({
            filterMode: false
        });
    },

    beforeDestroy() {
        this.systemStore.$patch(state => {
            state.initialized = false;
        });
    },

    methods: {
        clearSelected() {
            this.systemStore.selected = [];
        },

        exitToDashboard() {
            this.$router.push({ name: this.module.slug + '-dashboard' });
        },

        hasPermissionTo(feature) {
            return this.features.includes(feature);
        },

        navigateToParent() {
            if (this.parent) {
                this.$router.push({
                    name: this.parent
                });
            }
        },

        openFilter() {
            this.filter.state = true;
        },

        openFormShow() {
            const targetRoute = this.$router.getRoutes().find(rt => rt.name === this.$route.name + '-show');
            
            if (!targetRoute) {
                this.systemStore.$snackbar({ text: 'target route does`nt exists.' })
                return;
            }
            
            const targetParams = {};

            if (targetRoute.path.includes(`:${this.slug}`)) {
                targetParams[this.slug] = this.currentRecord[this.systemStore.recordKey];
            }

            this.$router.push({ 
                name: this.$route.name + '-show', 
                params: { ...targetParams, ...this.$route.params } 
            });
        },

        navigateToRouteCreate() {
            const targetRoute = this.$router.getRoutes().find(rt => rt.name === this.$route.name + '-create');
            
            if (!targetRoute) {
                this.systemStore.$snackbar({ text: 'target route does`nt exists.' })
                return;
            }

            this.$router.push({ name: this.$route.name + '-create', params: this.$route.params });
        }
    }
}
</script>