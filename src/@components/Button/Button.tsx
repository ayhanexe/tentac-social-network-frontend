import IButton from './Button.types'

import "./Button.scss"

export default function Button(props: IButton) {
  return (
    <button className="form-button py-3 rounded-xl font-black">{props.children}</button>
  )
}
