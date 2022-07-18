<template>
    <v-card :color="`${theme} darken-2`" flat tile height="100%">
        <v-toolbar 
            :class="`rounded-t-lg z-index-1`"
            tile
            flat
        >
            <v-btn
                icon
                @click="navigateToParent()"
            >
                <v-icon>arrow_back</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-toolbar-title class="text-uppercase pl-0">
                <span class="overline" :class="`${theme}--text`">{{ title ? title : 'form' }}:show</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <slot name="toolbar" 
                :links="links" 
                :record="currentRecord"
                :store="systemStore"
                :theme="theme"
            ></slot>

            <moui-button v-if="!disableEdit"
                :color="`${theme} darken-1`"
                icon="edit"
                tooltip="Ubah"
                @click="openFormEdit"
            ></moui-button>

            <moui-button v-if="!disableDelete"
                :color="`deep-orange darken-1`"
                icon="delete"
                tooltip="Hapus"
                @click="dialog.delete = true"
            ></moui-button>
        </v-toolbar>

        <v-sheet
            :class="`rounded-b-lg ${theme} lighten-4`"
            height="calc(100vh - 72px)"
        >
            <v-responsive
                :class="`${theme} lighten-5 relative overflow-y-auto z-index-0 rounded-b-lg`"
                height="calc(100vh - 72px)"
            >
                <v-sheet 
                    :height="height"
                    :width="width"
                    :max-width="width"
                    class="d-flex mx-auto flex-column transparent"
                    flat tile
                >
                    <div class="relative pt-6">
                        <slot :combos="combos" :record="currentRecord" :theme="theme"></slot>
                    </div>
                </v-sheet>
            </v-responsive>
        </v-sheet>

        <v-dialog
            v-model="dialog.delete"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="text-h6">Hapus data ini?</v-card-title>
                
                <v-card-text>Proses ini akan juga menghapus semua data yang terkait pada data ini.</v-card-text>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn :color="theme" text @click="dialog.delete = false">Batal</v-btn>
                    <v-btn color="error" text dark @click="postFormDelete">Hapus</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'form-show',

    props: {
        disableEdit: {
            type: Boolean,
            default: false
        },

        disableDelete: {
            type: Boolean,
            default: false
        },

        height: {
            type: String,
            default: "100%"
        },

        paramKey: {
            type: String,
            default: null
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
            default: null
        },

        width: {
            type: String,
            default: "500"
        },
    },

    setup() {
        const systemStore = useSystemStore();
        const { combos, currentRecord, dialog, links, theme } = storeToRefs(systemStore);
        
        return {
            systemStore,
            combos, currentRecord, dialog, links, theme
        }  
    },

    created() {
        this.systemStore.$patch(state => {
            state.page = this.slug;
            state.currentRoute = this.$route;
            state.filter.data = {};
            state.filter.state = false;
        });

        this.systemStore.fetchSingleRecord(
            this.paramKey, (response) => {
                this.$emit('initialized', response);
            }
        );
    },

    methods: {
        navigateToParent() {
            if (this.parent) {
                this.$router.push({
                    name: this.parent
                });
            }
        },

        openFormEdit() {
            const targetRoute = this.$router.getRoutes().find(rt => rt.name === this.parent + '-edit');
            
            if (!targetRoute) {
                this.pageStore.$snackbar({ text: 'target route does`nt exists.' })
                return;
            }

            this.$router.push({ 
                name: this.parent + '-edit', 
                params: this.$route.params 
            });
        },

        postFormDelete() {
            this.systemStore.$http(this.systemStore.dataURL + '/' + this.$route.params[this.paramKey], {
                method: 'DELETE'
            })
            .then(() => {
                this.systemStore.$snackbar({
                    color: 'success',
                    text: 'Hapus data berhasil.',
                });

                this.navigateToParent();
            })
            .catch((e) => {
                this.systemStore.recordErrorHandler(e);
            });
        }
    }
}
</script>