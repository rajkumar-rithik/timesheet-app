<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="indigo--text text--darken-4"
        >
          <v-list-item v-for="link in items" :key="link.text" router :to="link.to">
            <v-list-item-icon class="mr-6">
              <v-icon right>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark elevation="0" color="#3f51b5" height="50" app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase">TimeSheet</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
        <router-view />
    </v-main>

  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    drawer: null,
    items: [
      {
        icon: 'mdi-timer',
        title: 'Timesheet',
        to: '/',
      },
      {
        icon: 'mdi-timetable',
        title: 'Work Log',
        to: '/log',
      },
      {
        title: 'Project',
        icon: 'mdi mdi-briefcase-check',
        to: '/project',
      },
    ]
  })
};
</script>