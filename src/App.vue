<template>
    <v-scroll-y-transition mode="out-in">
        <router-view v-if="isFontLoaded"
        ></router-view>

        <moui-loading v-else
        ></moui-loading>
    </v-scroll-y-transition>
</template>

<script>
import WebFontLoader from 'webfontloader';

export default {
    data:() => ({
        isFontLoaded: false,
    }),

    mounted() {
        WebFontLoader.load({
            custom: {
                families: ['Fredoka One', 'Roboto:100,300,400,500,700', 'Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'],
                urls: ['/fonts/webfonts.min.css']
            },
            
            active:() => {
                this.isFontLoaded = true;
            },

            timeout: 5000
        });
    }
}
</script>