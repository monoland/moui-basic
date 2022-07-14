<template>
    <v-app>
        <v-main class="light-blue">
            <v-container fill-height fluid>
                <v-row class="relative" align-content="center" justify="center">
                    <span class="absolute d-flex align-center justify-center copyright light-blue--text text--darken-4"
                        style="height: 50px;"
                    >
                        <small>simasten</small>
                    </span>

                    <div id="preloader">
                        <div id="loader"></div>
                    </div>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'moui-loading'
}
</script>