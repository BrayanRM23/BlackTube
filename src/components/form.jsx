import './styles/styles.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Form({ callback }) {
    const [username, setUsername] = useState("");  
    const [password, setPassword] = useState("");  
    const goTo = useNavigate();

    const validateUser = (event) => {
        event.preventDefault();
      
        if (!username || !password) {
          alert("Por favor, complete todos los campos.");
          return;
        }
      
        fetch('blackback01.vercel.app/papa/login', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        })
          .then(res => res.json())
          .then(responseData => {
            if (responseData.resultado === 'user') {
              localStorage.setItem('loggedUser', username); // Guardar el usuario en sesión
              callback(username);
              goTo('/userHome');
            } else if (responseData.resultado === 'admin') {
              localStorage.setItem('loggedUser', username); // Guardar el usuario en sesión
              callback(username);
              goTo("/adminHome");
            } else {
              alert("Credenciales inválidas");
            }
          })
          .catch(error => {
            console.error("Error en la solicitud:", error);
            alert("Hubo un error en la solicitud. Inténtalo de nuevo.");
          });
      };
      

    return (
        <form onSubmit={validateUser}>
            <h1 id="txtBienvenida">¡bienvenido a Black tube!</h1>
            
            <h4 className="txt">Nombre de Usuario</h4>  
            <input 
                type="text" 
                className="entry" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            /><br />

            <h4 className="txt">Contraseña</h4>  
            <input 
                type="password" 
                className="entry" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            /><br />

            <input type="submit" value="Ingresar" id="btnEnviar" />

            <button onClick={() => goTo("/crearusers")} id="forgotPasswordLink">Registrarme</button>
        </form>   
    );
}
import PropTypes from 'prop-types';

Form.propTypes = {
  callback: PropTypes.func.isRequired,
};


export default Form;

