<template>
    <v-app>
        <v-system-bar app :color="`${theme} darken-2`" height="4" style="z-index: 9;">
            <v-progress-linear
                :active="loading.state"
                :indeterminate="loading.state"
                color="deep-orange"
                height="4"
                width="100vw"
                absolute
                top
            ></v-progress-linear>
        </v-system-bar>

        <v-overlay :color="`${theme}`" :value="loading.state" opacity="0.36" z-index="8">
            <v-progress-circular
                indeterminate
                size="32"
                width="2"
            ></v-progress-circular>
        </v-overlay>

        <!-- page-drawer -->
        <moui-drawer>
            <slot name="drawer"></slot>
        </moui-drawer>

        <!-- main -->
        <v-main class="desktop" :class="`${theme} darken-2 height-100vh overflow-y-hidden`">
            <v-fade-transition mode="out-in">
                <router-view></router-view>
            </v-fade-transition>
        </v-main>

        <!-- snackbar -->
        <moui-snackbar></moui-snackbar>

        <!-- slot -->
        <slot></slot>
    </v-app>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'page-base',

    setup() {
        const systemStore = useSystemStore();
        const { loading, page, theme } = storeToRefs(systemStore);

        return { 
            systemStore,
            loading, page, theme
         };
    },
}
</script>