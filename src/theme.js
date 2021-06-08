import { purple } from '@material-ui/core/colors'
import  { createMuiTheme } from '@material-ui/core/styles'
import { dark } from '@material-ui/core/styles/createPalette'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
          main: purple[500],
        },
        secondary: {
            main: '#11cb5f',
        },
    }
})

export default theme