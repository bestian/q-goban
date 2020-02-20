import Firebase from 'firebase/app'
import 'firebase/firestore' // eslint-disable-line
import firebaseConfig from '../../firebase.conf'

export default ({ Vue }) => {
  // Initialize Firebase from settings
  if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig)
  }
  Vue.prototype.$firebase = Firebase
}
