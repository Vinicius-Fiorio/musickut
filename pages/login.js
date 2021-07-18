import React from 'react';
// Hook do NextJS
import { useRouter } from 'next/router';
import nookies from 'nookies';
import styled from 'styled-components';

const MessageError = styled.div`
    align-items: top;
    padding: 20px;
    margin-top: -515px;
    height: 10vh;
    justify-content: top; 
    position: absolute;
    background: #111528;
    color: #ffffff;
    border-radius: 10px;
    animation: 1s;
    opacity: ${({toggle}) => toggle ? '0': '1'} ;
 `;

export default function LoginScreen() {
  const router = useRouter();
  const [githubUser, setGithubUser] = React.useState('');
  const [toggle, setToggle] = React.useState(true);

  return (
    
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', background: '#0f0f1a' }}>
      <MessageError toggle={toggle}>Usuário Inválido! Digite seu usuário do Github</MessageError>
      <div className="loginScreen" >
        <section className="logoArea" style={{ backgroundImage: 'url(https://images2.alphacoders.com/701/thumb-1920-70172.jpg)',
            backgroundPosition: 'bottom',
            backgroundSize: 'cover',
            fontWeight: 'bold'
            }}>
            <p style={{ 
                fontFamily: 'Montserrat',
                color: '#d81d99',
                fontSize: '32px', 
                fontWeight: 'bold',
            
            }}>Musickut</p>

          <p style={{ color:'#FFFFFF'}}><strong>Conecte-se</strong> com playlists criadas pelos usuários</p>
          <p style={{ color:'#FFFFFF'}}><strong>Conheça</strong> pessoas através de suas playlists</p>
          <p style={{ color:'#FFFFFF'}}><strong>Dê uma estrela</strong> para este projeto no Github</p>
        </section>

        <section className="formArea" style={{ background: '#111528', borderRadius: '10px', color:'#FFFFFF'}}>
          <form className="box" style={{ background: '#111528'}} onSubmit={(infosDoEvento) => {
                infosDoEvento.preventDefault();
                console.log('Usuário: ', githubUser)

                if(githubUser != ''){
                    let responseUser;

                    fetch(`https://api.github.com/users/${githubUser}`)
                    .then((responseServer) => responseServer.json())
                    .then((response) =>{
                        responseUser = response;
                    })
                    .then(() =>{
                        if(!('message' in responseUser)){
                            console.log('User valido')
                            setToggle(true)
                            fetch('https://alurakut.vercel.app/api/login', {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json'  
                                },
                                body: JSON.stringify({ githubUser: githubUser })
                            })
                            .then(async (respostaDoServer) => {
                                const dadosDaResposta = await respostaDoServer.json()
                                const token = dadosDaResposta.token;
                                nookies.set(null, 'USER_TOKEN', token, {
                                    path: '/',
                                    maxAge: 86400 * 7 
                                })
                                router.push('/')
                            })
                        }else{
                            //quando não tiver no github
                            console.log('usuario invalido')
                            setToggle(false)
                        }
                    })
                }else{
                    console.log('User invalido')
                    setToggle(false)
                }
                
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
          </p>
            <input
                placeholder="Usuário"
                value={githubUser}
                onChange={(evento) => {
                    setGithubUser(evento.target.value)
                }}

                style={{ background: '#1b2134', border: 'none', color: '#ffffff'}}
            />
            {githubUser.length === 0
                ? 'Preencha o campo'
                : ''
            }
            <button type="submit" style={{ background: '#d81d99'}}>
              Login
            </button>
          </form>

          <footer className="box" style={{ background: '#111528'}}> 
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong style={{ color: '#d81d99'}}>
                  ENTRAR JÁ
              </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea" style={{ background: '#111528', color: '#ffffff'}}>
          <p style={{ aligntText: 'center'}}>
            © 2021 alura.com.br 
          </p>
        </footer>
      </div>
    </main>
  )
}