<template>
    <div class="d-flex flex-column align-center"
        @click="$emit('click')"
    >
        <v-avatar
            color="blue-grey darken-1"
            class="elevation-5"
            rounded="lg"
            size="64"
            style="cursor: pointer;"
        >
            <v-icon dark>{{ icon }}</v-icon>
        </v-avatar>

        <div class="d-flex align-center justify-center height-100 px-1 pt-2">
            <div 
                class="text-caption font-weight-medium text-center text-uppercase line-height-1-point-2 width-100" 
                :class="`${theme}--text text--darken-1`"
            ><small>{{ label }}</small></div>
        </div>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'moui-dockbar-item',

    props: {
        icon: {
            type: String,
            default: null,
        },

        label: {
            type: String,
            default: null,
        }
    },
    
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