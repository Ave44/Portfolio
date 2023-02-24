import axios from "axios";

const SaveLogs = (props) => {

    const save = (minutes, victories) => {
        const time = new Date().toLocaleTimeString()
        const content = {log: `${time} | user: ${props.id} | minutes: ${minutes} | victories: ${victories}`};

        axios.post('http://localhost:5000/logs', content)
            .then(res => {
                window.alert(`'${res.data}' got saved`)
            })
            .catch(err => {
                window.alert("Threre was a problem")
                console.log(err)
            })
    }
    return <div className="button log" onClick={()=>{save(props.minutes, props.victories)}}>save to log file</div>
}

export default SaveLogs