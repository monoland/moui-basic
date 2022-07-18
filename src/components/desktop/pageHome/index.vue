<template>
    <v-card :color="`${theme} darken-2`" flat tile height="100%">
        <v-toolbar 
            :class="`rounded-t-lg z-index-1`"
            tile
            flat
        >
            <v-spacer></v-spacer>

            <v-toolbar-title class="text-uppercase pl-0">
                <span class="font-fredoka-one spacing-1" :class="`${theme}--text`">Dashboard</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <moui-button
                icon="logout"
                tooltip="Keluar"
            ></moui-button>
        </v-toolbar>

        <v-sheet
            :class="`rounded-b-lg`"
            height="calc(100vh - 72px)"
        >
            <v-responsive
                class="relative overflow-y-auto z-index-0 rounded-b-lg"
                height="calc(100vh - 72px)"
                :content-class="`d-flex flex-column ${theme} lighten-5 rounded-lg`"
            >
                <slot name="dockbar"></slot>

                <div class="relative d-flex flex-column flex-grow-1">
                    <v-sheet
                        rounded="lg"
                        :class="`flex-grow-1 pa-4 ${theme} lighten-4`"
                        height="100%"
                    >
                        <slot :store="systemStore" :theme="theme"></slot>
                    </v-sheet>
                </div>
            </v-responsive>
        </v-sheet>
    </v-card>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'page-home',
    
    setup() {
        const systemStore = useSystemStore();
        const { theme } = storeToRefs(systemStore);

        return { 
            systemStore,
            theme
        };
    },
}
</script>