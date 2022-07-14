<template>
    <v-app v-cloak>
        <v-main>
            <v-row no-gutters style="height: 100%;">
                <v-col class="d-flex flex-column align-center justify-center" cols="6">
                    <v-card class="transparent" flat width="600">
                        <v-img src="/img/3593965.jpg"></v-img>
                    </v-card>

                    <a 
                        class="caption absolute" 
                        href="https://www.freepik.com/vectors/user-testing"
                        style="bottom: 8px;"
                    >user testing vector created by www.freepik.com</a>
                </v-col>

                <v-col class="light-blue lighten-5 d-flex flex-column align-center justify-center" cols="6">
                    <v-card width="400" rounded="lg">
                        <div class="font-fredoka-one blue--text text-center mt-4" style="font-size: 48px;">WELCOME</div>

                        <v-card-text>
                            <v-form>
                                <v-text-field
                                    autocomplete="off"
                                    label="Alamat email"
                                    placeholder="simasten@bantenprov"
                                    ref="email"
                                    outlined
                                ></v-text-field>

                                <v-text-field
                                    autocomplete="off"
                                    label="Masukkan sandi Anda"
                                    ref="password"
                                    outlined
                                ></v-text-field>

                                <v-btn block color="primary" depressed>signin</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'moui-authent',
}
</script>