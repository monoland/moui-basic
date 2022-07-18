<template>
    <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-bind="attrs"
                v-on="on"
                :class="buttonClass"
                :color="color"
                :disabled="disabled"
                :fab="fab"
                :icon="!fab"
                :loading="loading"
                @click="$emit('click')"
            >
                <v-icon>{{ icon }}</v-icon>
            </v-btn>
        </template>

        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'moui-button',

    props: {
        action: {
            type: Function,
            default: null,
        },

        buttonClass: {
            type: String,
            default: ''
        },

        color: {
            type: String,
            default: null,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        fab: {
            type: Boolean,
            default: false,
        },

        icon: {
            type: String,
            default: null,
        },

        loading: {
            type: Boolean,
            default: false,
        },

        tooltip: {
            type: String,
            default: null,
        }
    },

    methods: {
        button_click: function () {
            if (typeof this.action == "function") {
                this.action();
            }
        }
    }
}
</script>