<template>
    <v-navigation-drawer
        :class="`elevation-0 ${theme} lighten-4 rounded-lg`"
        absolute
        right
        temporary
        overlay-opacity="0.27"
        width="360"
        v-model="filter.state"
    >
        <template v-slot:prepend>
            <v-toolbar flat>
                <v-toolbar-title>Filter Data</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon @click="filter.state = false">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
        </template>
        
        <v-sheet
            :class="`${theme} lighten-4 px-4`"
        >
            <!-- pencarian -->
            <v-card class="my-4" flat>
                <v-card-text class="d-flex py-1">
                    <div class="overline">pencarian data</div>
                </v-card-text>
                
                <v-divider></v-divider>
                
                <v-card-text class="py-2">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-text-field
                                label="Pencarian Data"
                                placeholder="Silahkan masukan pencarian"
                                v-model="search.findBy"
                                clearable
                                @click:clear="clearPageFilter"
                                v-on:keyup.enter="applyPageFilter"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <!-- filters -->
            <slot>
                <v-card class="my-4" v-for="(filter, index) in filter.data" :key="`filter-${index}`">
                    <v-card-text class="d-flex align-center py-1 pr-2">
                        <div class="overline">Filter {{ filter.title }}</div>
                        
                        <v-spacer></v-spacer>

                        <v-btn icon small @click="clearFilterOn(index)">
                            <v-icon>clear</v-icon>
                        </v-btn>
                    </v-card-text>
                    
                    <v-divider></v-divider>

                    <v-card-text class="py-2">
                        <v-row dense>
                            <v-col cols="3">
                                <v-select
                                    :items="filter.operators"
                                    label="Oprt"
                                    v-model="filter.operator"
                                ></v-select>
                            </v-col>

                            <v-col cols="9">
                                <v-text-field v-if="!filter.data"
                                    :label="filter.title"
                                    v-model="filter.value"
                                ></v-text-field>

                                <v-select v-else-if="filter.data && filter.data.length <= 10"
                                    :items="filter.data"
                                    :label="filter.title"
                                    v-model="filter.value"
                                ></v-select>

                                <v-combobox v-else
                                    :items="filter.data"
                                    :label="filter.title"
                                    v-model="filter.value"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </slot>
        </v-sheet>

        <template v-slot:append>
            <v-card-text>
                <v-btn block :color="theme" dark depressed @click="applyPageFilter">filter data</v-btn>
            </v-card-text>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'moui-filter',

    setup() {
        const pageStore = useSystemStore();

        let { current, features, filter, search, theme } = storeToRefs(pageStore);

        return { 
            pageStore,
            current, features, filter, search, theme 
        };
    },

    methods: {
        applyPageFilter() {
            this.pageStore.fetchPageRecords({
                filterMode: false
            });
        },

        clearFilterOn(index) {
            this.filter.data[index].value = null;
            this.filter.data[index].operator = null;
        },

        clearPageFilter() {
            this.pageStore.$patch(state => {
                state.search.findBy = null;
            });

            this.pageStore.fetchPageRecords({
                filterMode: false
            });
        },

        hasPermission(permission) {
            return this.features.indexOf(permission) !== -1;
        }
    }
}
</script>