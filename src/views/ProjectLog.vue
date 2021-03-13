<template>
  <v-data-table
    :headers="headers"
    :items="projects"
    sort-by="id"
    class="elevation-3 ma-6"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Log Work
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row
                class="mb-5"
                no-gutters
                >
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.project_id"
                      label="Project"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.task_id"
                      label="Task"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-textarea
                      v-model="editedItem.log_description"
                      label="Log Description"
                      maxlength="500"
                      counter
                      outlined
                    ></v-textarea>
                  </v-col>

                    <v-checkbox
                      v-model="period"
                      :label="`Period`"
                      class="ma-0"
                    ></v-checkbox>

                  <v-col
                    cols="12"
                    v-if="period"
                  >

                    <vc-date-picker v-model="range" is-range>
                      <template v-slot="{ inputValue, inputEvents }">
                        <div class="d-flex flex-row">
                            <v-text-field
                              v-model="inputValue.start"
                              label="From Date"
                              prepend-inner-icon="mdi-calendar"
                              v-on="inputEvents.start"
                              outlined
                              class="border mr-3 focus:border-indigo-300"
                            ></v-text-field>
                            <v-text-field
                              v-model="inputValue.end"
                              label="To Date"
                              prepend-inner-icon="mdi-calendar"
                              v-on="inputEvents.end"
                              outlined
                              class="border focus:border-indigo-300"
                              ></v-text-field>
                        </div>
                      </template>
                    </vc-date-picker>

                  </v-col>

                  <v-col
                    cols="12"
                    v-else
                  >

                  <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.log_date"
                          label="Log Date"
                          prepend-inner-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          outlined
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.log_date"
                        @input="menu = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>


                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.log_hour"
                      prepend-inner-icon="mdi mdi-timer-outline"
                      label="Log Hour"
                      outlined
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="editItem"
      >
        Add
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
  import axios from "axios";

  export default {
    name: "ProjectLog",
    data: () => ({
      menu: false,
      period: false,
      dialog: false,
      dialogDelete: false,
      range: {
        start: new Date(),
        end: new Date(),
      },
      headers: [
        {
          text: 'Project ',
          align: 'start',
          sortable: false,
          value: 'project_id',
        },
        { text: 'Task', value: 'task_id' },
        { text: 'Log Hours', value: 'log_hour' },
        { text: 'Log Date', value: 'log_date' },
        { text: 'Created Date', value: 'created_date' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      projects: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        project_id: null,
        task_id: null,
        log_description: '',
        user_id: null,
        log_hour: null,
        log_date: null
      },
      defaultItem: {
        id: null,
        project_id: null,
        task_id: null,
        log_description: '',
        user_id: null,
        log_hour: null,
        log_date: null
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Work Log' : 'Edit Work Log'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get('http://localhost:3001/log')
      .then((response) => {
          this.projects = response.data;
      })
      .catch((err) => {
          console.log('Not Received', err);
      });
      },

      editItem (item) {
        this.editedIndex = this.projects.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.projects.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        axios({
          url: "http://localhost:3001/log/" + this.editedItem.id,
          method: "DELETE"
        })
        .then(() => {
          this.initialize();
        })
        .catch((err) => {
          console.log('Not Received', err);
        });

        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          axios({
            url: "http://localhost:3001/log/" + this.editedItem.id,
            method: "PUT",
            data: {
              "project_id": this.editedItem.project_id,
              "task_id": this.editedItem.task_id,
              "log_description": this.editedItem.log_description,
              "user_id": 1,
              "log_hour": this.editedItem.log_hour,
              "log_date": this.editedItem.log_date
              }
          })
          .then(() => {
            this.initialize();
          })
          .catch((err) => {
            console.log('Not Received', err);
          });
        } else {
          axios({
            url: "http://localhost:3001/log",
            method: "POST",
            data: {
              "project_id": this.editedItem.project_id,
              "task_id": this.editedItem.task_id,
              "log_description": this.editedItem.log_description,
              "user_id": 1,
              "log_hour": this.editedItem.log_hour,
              "log_date": this.editedItem.log_date,
              "period": this.period,
              "from_date": this.range.start,
              "to_date": this.range.end,
              }
          })
          .then(() => {
            this.initialize();
          })
          .catch((err) => {
            console.log('Not Received', err);
          });
        }
        this.close()
      },
    },
  }
</script>