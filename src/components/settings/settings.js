import StyleSwitcher from '../style_switcher/style_switcher.vue'
import { filter, trim } from 'lodash'

const settings = {
  data () {
    return {
      hideAttachmentsLocal: this.$store.state.config.hideAttachments,
      hideAttachmentsInConvLocal: this.$store.state.config.hideAttachmentsInConv,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      muteWordsString: this.$store.state.config.muteWords.join('\n')
    }
  },
  components: {
    StyleSwitcher
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    uploadAvatar ({target}) {
      const file = target.files[0]
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({target}) => {
        const img = target.result

        this.$store.state.api.backendInteractor.updateAvatar({params: {img}}).then((user) => {
          if (!user.error) {
            this.$store.commit('addNewUsers', [user])
            this.$store.commit('setCurrentUser', user)
          }
        })
      }
      reader.readAsDataURL(file)
    }
  },
  watch: {
    hideAttachmentsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachments', value })
    },
    hideAttachmentsInConvLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachmentsInConv', value })
    },
    hideNsfwLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideNsfw', value })
    },
    muteWordsString (value) {
      value = filter(value.split('\n'), (word) => trim(word).length > 0)
      this.$store.dispatch('setOption', { name: 'muteWords', value })
    }
  }
}

export default settings
