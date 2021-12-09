new Vue({
    el: '#app',
    data: {
        columns: ['Id', 'Last Name', 'First Name', 'Birth day', 'Age'],
        persons: null,
        bin: [],
        /*input: {
          lname: "WADE",
          fname: "Johnson",
          age: 38,
          job: "Comedian",
          address: "Roma/Italia"
        },*/
        editInput: {
            id: "",
            LName: "",
            FName: "",
            BirthDay: "",
            Age: "",
        }
      },
    mounted() {
        axios.get('/api/read')
             .then(response=> {
                 //alert(JSON.stringify(response.data));
                 if (response.status= 200)
                     this.persons= response.data;
                 else
                      console.log('error');
             })
             .catch(error=> console.log(error))
      },
    methods: {
      //function to add data to table
      add: function() {
        this.persons.push({
          id: this.input.id,
          LName: this.input.LName,
          FName: this.input.FName,
          BirthDay: this.input.BirthDay,
          Age: this.input.Age
        });
  
        for (var key in this.input) {
          this.input[key] = '';
        }
        this.persons.sort(ordonner);
        this.$refs.lname.focus();
      },
      //function to handle data edition
      edit: function(index) {
        this.editInput = this.persons[index];
        console.log(this.editInput);
        this.persons.splice(index, 1);
      },
      //function to send data to bin
      archive: function(index) {
        this.bin.push(this.persons[index]);
        this.persons.splice(index, 1);
        this.bin.sort(ordonner);
      },
      //function to restore data
      restore: function(index) {
        this.persons.push(this.bin[index]);
        this.bin.splice(index, 1);
        this.bin.sort(ordonner);
      },
      //function to update data
      update: function(){
        // this.persons.push(this.editInput);
         this.persons.push({
          id: this.editInput.id,
          LName: this.editInput.LName,
          FName: this.editInput.FName,
          BirthDay: this.editInput.BirthDay,
          Age: this.editInput.Age
        });
         for (var key in this.editInput) {
          this.editInput[key] = '';
        }
        this.persons.sort(ordonner);
      },
      //function to defintely delete data 
      deplete: function(index) {
        // console.log(this.bin[index]);
        this.bin.splice(index, 1);
      }
    },
    computed: {
        sortedPersons: function() {
            return this.persons.sort((a, b)=> {
                return (a.age> b.age)
            })
        }
    }
});
  
//function to sort table data alphabetically
var ordonner = function(a, b) {
    return (a.age > b.age);
};

$(function() {
    //initialize modal box with jquery
    $('.modal').modal();
});