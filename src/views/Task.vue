<template>
  <v-data-table
    :headers="headers"
    :items="tasks"
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
              New Task
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
                      v-model="editedItem.title"
                      label="Title"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.reporter"
                      label="Reporter"
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
    name: "Task",
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Title',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Description', value: 'description' },
        { text: 'Reporter', value: 'reporter' },
        { text: 'Created Date', value: 'created_date' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      tasks: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        title: '',
        description: '',
        reporter: '',
      },
      defaultItem: {
        id: null,
        title: '',
        description: '',
        reporter: '',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
        axios.get('http://localhost:3001/task')
      .then((response) => {
          this.tasks = response.data;
      })
      .catch((err) => {
          console.log('Not Received', err);
      });
      },

      editItem (item) {
        this.editedIndex = this.tasks.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.tasks.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        axios({
          url: "http://localhost:3001/task/" + this.editedItem.id,
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
            url: "http://localhost:3001/task/" + this.editedItem.id,
            method: "PUT",
            data: {
              "title": this.editedItem.title,
              "description": this.editedItem.description,
              "reporter": this.editedItem.reporter
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
            url: "http://localhost:3001/task",
            method: "POST",
            data: {
              "title": this.editedItem.title,
              "description": this.editedItem.description,
              "reporter": this.editedItem.reporter
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