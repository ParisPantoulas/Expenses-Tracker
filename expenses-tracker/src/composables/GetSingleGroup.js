import { ref } from 'vue'

const getGroup = (id) => {

  const group = ref([])
  const error = ref(null)

  const load = async () => {
    try {
      let data = await fetch('http://localhost:3000/groups/' + id)
      if(!data.ok) {
        throw Error('no available data')
      }
      group.value = await data.json()
    }
    catch(err) {
      error.value = err.message
    }
  }

  return { group, error, load }
}

export default getGroup
