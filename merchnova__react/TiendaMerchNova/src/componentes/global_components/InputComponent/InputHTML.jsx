import './InputHTML.css';

function InputHTMLComponent(props) {
    return (
        <div className="mb-3">
            <label className="form-label">{props.labelInput}</label>
            <input 
                className="form-control" 
                type={props.tipo} 
                id={props.id} 
                name={props.nameInput} 
                placeholder={props.placeholder} 
                onChange={props.change}/>
        </div>
    )
}

export default InputHTMLComponent