<template>
    <v-snackbar v-model="snackbar.state" :color="snackbar.color" :timeout="3500">
        <template v-if="typeof snackbar.text === 'string'">
            {{ snackbar.text }}
        </template>

        <div v-else-if="snackbar.text && snackbar.text.constructor === Array"
            class="d-flex flex-column"
        >
            <span v-for="(message, index) in snackbar.text" :key="index"
                class="b-block"
            >{{ message }}</span>
        </div>
        
        <template v-slot:action="{ attrs }">
            <v-btn dark text v-bind="attrs" @click.stop.prevent="snackbar.state = false">tutup</v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useSystemStore } from '@stores/systemStore';

export default {
    name: 'moui-snackbar',

    setup() {
        const system = useSystemStore();
        const { snackbar } = storeToRefs(system);

        return { snackbar };
    },
}
</script>