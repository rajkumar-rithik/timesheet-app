<template>
<div>
  <div class="d-flex flex-row">
  <vc-date-picker v-model="range" is-range>
    <template v-slot="{ inputValue, inputEvents }">
      <div class="d-flex flex-row" style="width: 100%">
          <v-text-field
            v-model="inputValue.start"
            label="From Date"
            prepend-inner-icon="mdi-calendar"
            v-on="inputEvents.start"
            outlined
            class="border ma-5 focus:border-indigo-300"
          ></v-text-field>
          <v-text-field
            v-model="inputValue.end"
            label="To Date"
            prepend-inner-icon="mdi-calendar"
            v-on="inputEvents.end"
            outlined
            class="border ma-5 focus:border-indigo-300"
            ></v-text-field>
      </div>
    </template>
  </vc-date-picker>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="ma-2 mt-8"
              v-bind="attrs"
              v-on="on"
            >
              Log Work
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">New Work Log</span>
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

                    <vc-date-picker v-model="log_range" is-range>
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
            <v-btn
              color="primary"
              dark
              class="ma-2 mt-8"
              v-bind="attrs"
              v-on="on"
            >
              Submit TimeSheet
            </v-btn>
        </div>

  <v-data-table
      :headers="headers"
      :items="project_data"
      sort-by="calories"
      class="elevation-3 ma-6"
    >
  </v-data-table>
  </div>
</template>

<script>
import axios from "axios"; 
export default {
  name: "Timesheet",
  data() {
  return {
    project_logs: [],
    project: [],
    project_data: [],
    period: false,
    menu: false,
    range: {
      start: new Date(2021, 2, 1),
      end: new Date(2021, 2, 7),
    },
    log_range: {
      start: new Date(),
      end: new Date(),
    },
    headers: [{ text: "Project", value: "project"}],
    dialog: false,
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
  };
},
watch: {
  dialog (val) {
    val || this.close()
  },
  range() {
    this.initialize()
  } 
},
created () {
  this.initialize()
},

methods: {
  initialize () {
    axios.get('http://localhost:3001/log')
    .then((response) => {
        this.headers = [{ text: "Project", value: "project"}]
        let row = {}
        let start_date = new Date(this.range.start);
        let end_date = new Date(this.range.end);
        for (var day = start_date; day <= end_date; day.setDate(day.getDate() + 1)) {
          this.headers.push({ text: day.toDateString(), value: day.toDateString()});
          row[day.toDateString()] = 0
        }
        console.log(this.range);

        this.project_logs = response.data;
        this.project = [ ... new Set(this.project_logs.map((x) => x["project_id"])) ]

        let temp_data = {}
        this.project.forEach((v) => {
          temp_data[v] = Object.assign({}, row);
        })

        this.project_logs.forEach((v) => {
          temp_data[v['project_id']][new Date(v['log_date']).toDateString()] += v['log_hour']
        });

        this.project_data = []
        for (const [ key, value ] of Object.entries(temp_data)) {
          this.project_data.push({"project": key, ...value});
        }

    })
    .catch((err) => {
        console.log('Not Received', err);
    });
  },
  close () {
    this.dialog = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  },
  save () {
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
        "from_date": this.log_range.start,
        "to_date": this.log_range.end,
        }
    })
    .then(() => {
      this.initialize();
    })
    .catch((err) => {
      console.log('Not Received', err);
    });
    this.close()
  },
}
};
</script>