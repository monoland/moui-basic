<template>
    <v-navigation-drawer
        :class="`${theme} darken-2 pl-1 rounded-b-lg`"
        :mini-variant="drawer.mini"
        v-model="drawer.state"
        height="calc(100vh - 8px)"
        disable-resize-watcher
        permanent
        app
    >
        <template v-slot:prepend>
            <v-toolbar class="rounded-t-lg" :class="drawer.mini ? 'mini-mode' : ''" flat>
                <v-avatar v-if="drawer.mini"
                    :color="theme" 
                    size="40" 
                    @click="drawer.mini = !drawer.mini"
                    style="cursor: pointer;"
                >
                    <div class="font-fredoka-one white--text text-center" style="font-size: 22px;">M</div>
                </v-avatar>

                <v-toolbar-title v-else
                    class="text-uppercase pl-0"
                    :class="`${theme}--text`"
                >
                    <span class="font-fredoka-one spacing-1">Monoland</span>
                </v-toolbar-title>

                <v-spacer></v-spacer>

                <v-app-bar-nav-icon
                    @click="drawer.mini = !drawer.mini"
                ></v-app-bar-nav-icon>
            </v-toolbar>
        </template>

        <div :class="`relative height-100 ${theme}`">
            <v-list nav class="white height-100">
                <v-list-item-group :color="`${theme} darken-2`">
                    <slot></slot>
                </v-list-item-group>
            </v-list>
        </div>

        <template v-slot:append>
            <v-sheet class="rounded-b-lg" height="32">
                <v-scale-transition origin="center center 0">
                    <div class="d-flex justify-center overline" key="mini-on" v-if="drawer.mini"><small>m&copy;22</small></div>
                    <div class="d-flex justify-center overline" key="mini-off" v-else><small>monoland.soft&copy;2022</small></div>
                </v-scale-transition>
            </v-sheet>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'moui-drawer',

    setup() {
        const systemStore = useSystemStore();
        const { drawer, theme } = storeToRefs(systemStore);

        return { 
            systemStore,
            drawer, theme
         };
    },
}
</script>

<style>
    .v-toolbar.mini-mode > .v-toolbar__content {
        padding: 4px 7px;
    }
</style>