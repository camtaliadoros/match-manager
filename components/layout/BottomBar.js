export default function BottomBar({action, title}) {

    return <button onClick={action}>{title}</button>
}