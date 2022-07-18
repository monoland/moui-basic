<template>
    <v-card
        :class="`mx-auto transparent ${theme} lighten-5 rounded-t-lg py-6`"
        flat
        tile
        width="100%"
    >
        <v-row class="justify-center align-start mx-auto">
            <slot></slot>
        </v-row>
    </v-card>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'moui-dockbar',
    
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