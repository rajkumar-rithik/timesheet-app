<template>
<div>
  <vc-date-picker v-model="range" is-range>
    <template v-slot="{ inputValue, inputEvents }">
      <div class="d-flex flex-row" style="width: 500px">
          <v-text-field
            v-model="inputValue.start"
            label="From Date"
            v-on="inputEvents.start"
            outlined
            class="border ma-5 focus:border-indigo-300"
          ></v-text-field>
          <v-text-field
            v-model="inputValue.end"
            label="To Date"
            v-on="inputEvents.end"
            outlined
            class="border ma-5 focus:border-indigo-300"
            ></v-text-field>
      </div>
    </template>
  </vc-date-picker>
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
    range: {
      start: new Date(2021, 1, 15),
      end: new Date(2021, 1, 21),
    },
    headers: [{ text: "Project", value: "project"}]
  };
},
watch: {
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
        for (var day = this.range.start; day <= this.range.end; day.setDate(day.getDate() + 1)) {
          this.headers.push({ text: day.toDateString(), value: day.toDateString()});
          row[day.toDateString()] = 0
        }

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
  }
}
};
</script>