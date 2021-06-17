const ACCOUNT_LINK = "https://services.metricsamsi.com/v1.0/dealers/Accounts/Google?apiKey="
const OPTION_LINK  = "https://services.metricsamsi.com/v1.0/dealers/Options"
const API_KEY      = "81c14de2-6891-461b-9ea6-3ed218675b8f"

var app = new Vue({
  el: '#app',
  
  data: {
    accounts: [],
    options: [],

    googleId: "",
    optionName: "",
    optionValue: "",
    platformName: "",
    rooftopGoogleOptionId: "",

  },

  methods: {
    async getAllAccounts() {

      let data = []
      try {
        let response = await fetch(ACCOUNT_LINK + API_KEY)
        response = await response.json()
        data = response.data
      } catch (error) {
        console.error(error)
      }
    
      return data
    },

    async getAllOptions(id) {
      let data = []
      try {
        let response = await fetch(`${OPTION_LINK + "/" + id}?apiKey=${API_KEY}`)

        response = await response.json()
        data = response.data
      } catch (error) {
        console.error(error)
      }
    
      return data
    },

    async selectChange(event) {
      let id = event.target.value
      this.googleId = id

      if(id)
        this.options = await this.getAllOptions(id)
      else
        this.options = []
    
    },

    async deleteOption(id) {
      let data = []
      try {
        let response = await fetch(`${OPTION_LINK + "/" + id}?apiKey=${API_KEY}`, {
          method: "DELETE"
        })

        response = await response.json()
        data = response.data
      } catch (error) {
        console.error(error)
      }
    
      return data
    },

    handlerSubmit() {

      let form = document.getElementById("optionForm")

      if( !form.checkValidity() ) {
        form.reportValidity()
        return
      }

      let data = {
        optionName: this.optionName,
        optionValue: this.optionValue,
        googleId: this.googleId,
        platformName: this.platformName,
        dotDigitalId: 2
      }
      
      if(this.rooftopGoogleOptionId) {
        this.updateOption(data, this.rooftopGoogleOptionId)
      }else{
        this.addOption(data)
      }

      this.rooftopGoogleOptionId = ""
      this.optionName = ""
      this.optionValue = ""
      this.platformName = ""
      this.rooftopGoogleOptionId = ""
      
    },

    async addOption(datos) {
      let data = null
      try {
        let response = await fetch(`${OPTION_LINK}?apiKey=${API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(datos)
        })

        response = await response.json()
        data = response.data
      } catch (error) {
        console.error(error)
      }
    
      this.options = [...this.options, data]
      this.closeModal()
    },

    async updateOption(datos, id) {
      let data = null
      try {
        let response = await fetch(`${OPTION_LINK + "/" + id}?apiKey=${API_KEY}`, {
          method: "PATCH",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify(datos)
        })

        response = await response.json()
        data = response.data
      } catch (error) {
        console.error(error)
      }
    
      let options = this.options.filter(opt => opt.rooftopGoogleOptionId != id)
      this.options = [...options, datos]
      this.closeModal()
    },

    openModal() {
      this.modal.show()
    },
    closeModal() {
      this.modal.hide()
    },

    buttonDelete(id) {
      this.deleteOption(id)
      this.options = this.options.filter(opt => opt.rooftopGoogleOptionId != id)
    },

    buttonEditClick(data) {
      this.optionName = data.optionName
      this.optionValue = data.optionValue
      this.platformName = data.platformName
      this.rooftopGoogleOptionId = data.rooftopGoogleOptionId
      this.openModal()
    }
  },

  async created() {
    this.accounts = await this.getAllAccounts();
    this.modal = new bootstrap.Modal(document.getElementById('optionModal'))
  },

})
