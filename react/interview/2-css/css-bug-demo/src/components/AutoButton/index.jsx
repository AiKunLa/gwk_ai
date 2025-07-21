import styles from './anotherbutton.module.css'
console.log(styles)
const AutoButton = ()=>{
    return (
        <button className={styles.button}>自动按钮</button>
    )
}
export default AutoButton