<template>
    <div class="relative rounded-b-lg overflow-hidden">
        <v-data-table
            fixed-header
            :class="`blue-grey lighten-5`"
            :height="tableHeight"
            :headers="headers"
            :items="collections"
            :item-key="recordKey"
            :server-items-length="recordsTotal"
            :options.sync="options"
            :footer-props="footer"
            :single-select="!multiSelect"
            :show-select="true"
            v-model="selected"
            @click:row="clickOnRow"
            @update:options="updateOptions"
        >
            <template #progress>
                <v-progress-linear :color="theme" height="1" indeterminate></v-progress-linear>
            </template>

            <template v-for="(column, columnIndex) in headers" #[`item.${column.value}`]="{ item, index }">
                <!-- icon -->
                <v-icon v-if="column.mode === 'icon'" 
                    :key="`icon-${columnIndex}`" 
                >{{ item[column.value] }}</v-icon>

                <v-icon v-else-if="column.mode === 'checked'" 
                    :key="`checked-${columnIndex}`" 
                    :color="item[column.value] ? 'green' : ''"
                >{{ item[column.value] ? 'check' : 'unpublished' }}</v-icon>

                <!-- color -->
                <v-icon v-else-if="column.mode === 'color'" 
                    :key="`color-${columnIndex}`" 
                    :color="item[column.value]"
                >gradient</v-icon>

                <!-- visibility -->
                <v-icon v-else-if="column.value === 'visibility'" 
                    :key="`visibility-${columnIndex}`"
                >
                    {{ item.visibility === true ? 'visibility' : 'visibility_off' }}
                </v-icon>

                <!-- has nested -->
                <template v-else-if="column.value === 'name' && ('nest_deep' in item)">
                    <div class="d-flex align-center" :class="item.nest_deep > 0 ? 'fill-height' : ''" 
                        :key="`nested-${columnIndex}`"
                    >
                        <template v-if="item.nest_deep !== -1">
                            <div class="nestedset d-flex align-center fill-height" v-for="(itm, idx) in item.nest_deep" :key="idx">
                                <template v-if="itm < item.nest_deep">
                                    <v-divider vertical></v-divider>
                                </template>
                                
                                <template v-if="itm === item.nest_deep">
                                    <v-divider vertical></v-divider>
                                    <v-divider class="mr-1"></v-divider>
                                </template>
                            </div>
                        </template>
                        <span class="flex-grow-1">{{ item.name }}</span>
                    </div>
                </template>

                <slot :name="`item.${column.value}`" :item="item" :index="index" v-else>
                    <span v-html="item[column.value]" :key="index" />
                </slot>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'moui-table',

    props: {
        multiSelect: {
            type: Boolean,
            default: false
        },

        withHeaderSlot: {
            type: Boolean,
            default: false
        },
    },

    setup() {
        const systemStore = useSystemStore();

        let { 
            collections, footer, headers, 
            options, recordKey, recordsTotal, 
            theme 
        } = storeToRefs(systemStore);

        return { 
            systemStore,
            collections, footer, headers, options, 
            recordKey, recordsTotal, theme 
        };
    },

    computed: {
        selected: {
            get() {
                return this.systemStore.selected;
            },

            set(selected) {
                this.systemStore.setSelected(selected);
            }
        }
    },

    data:() => ({
        tableHeight: 'calc(100vh - 131px)'
    }),

    created() {
        if (this.withHeaderSlot) {
            this.tableHeight = 'calc(100vh - 186px)';
        }
    },

    methods: {
        clickOnRow: function(item, { select, isSelected }) {
            select(!isSelected);
        },

        updateOptions() {
            // this.systemStore.updateOptions(options);
        }
    }
}
</script>

<style>
    .v-data-footer__pagination {
        min-width: 150px;
    }

    .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th:nth-child(2),
    .theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > td:nth-child(2) {
        padding-left: 9px;
    }
</style>