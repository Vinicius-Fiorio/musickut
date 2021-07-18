import React from 'react'
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props){
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}> @{props.githubUser}</a>
      </p>

      <hr/>
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelations(props){
  return(
    <>
      <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            {props.title} ({props.items.length})
          </h2>

          <ul>  
              {
                props.items.map((itemAtual) => {
                  if(props.type == 'people'){
                    return (
                      <li key={itemAtual.id}>
                        <a href={itemAtual.html_url} target='_blank'>
                          <img src={itemAtual.avatar_url} />
                          <span>{itemAtual.login}</span>
                        </a>
                      </li>
                    )
                  }else if(props.type == 'comunity'){
                    return (
                      <li key={itemAtual.id}>
                        <a href={itemAtual.link} target='_blank'>
                          <img src={itemAtual.imageUrl} />
                          <span>{itemAtual.title}</span>
                        </a>
                    </li>
                    )
                  }else if(props.type == 'followers'){
                    return (
                      <li key={itemAtual.creatorplaylist}>
                        <a href={`https://github.com/${itemAtual.creatorplaylist}`} target='_blank'>
                          <img src={`https://github.com/${itemAtual.creatorplaylist}.png`} />
                          <span>{itemAtual.creatorplaylist}</span>
                        </a>
                      </li>
                    )
                  }
                  
                }) 
              }
          </ul>
        </ProfileRelationsBoxWrapper>
    </>
  )
}

export default function Home(props) {

  const usuarioAleatorio = props.githubUser;

  const [comunidades,setComunidades] = React.useState([]);

  const [seguidores, setSeguidores ] = React.useState([])

  const [pessoasFavoritas, setPessoasFavoritas ] = React.useState([])

  React.useEffect(function (){
    fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `6fcc7ab489db8d2582091a416ba967`,
        },
        body: JSON.stringify({
          query: `query {
            allCommunities {
              creatorplaylist
            }
          }`
        }),
      }
    )
    .then(res => res.json())
    .then((res) => {
      let criadores = res.data.allCommunities;

      criadores = criadores.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null))

      setSeguidores(criadores);
    })
    .catch((error) => {
      console.log(error);
    });
    
    fetch('https://api.github.com/repos/Vinicius-Fiorio/musickut/stargazers')
    .then((responseServer)=>{
      return responseServer.json();
    })
    .then((response) =>{
      setPessoasFavoritas(response);
    })

    fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `6fcc7ab489db8d2582091a416ba967`,
        },
        body: JSON.stringify({
          query: `query {
            allCommunities {
              id
              title
              imageUrl
              link
              _createdAt
            }
          }`
        }),
      }
    )
    .then(res => res.json())
    .then((res) => {
      console.log(res.data.allCommunities)
      setComunidades(res.data.allCommunities);
    })
    .catch((error) => {
      console.log(error);
    });

  }, [])

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio}/>

      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>

            <OrkutNostalgicIconSet confiavel={3} legal={3} sexy={1}/>
          </Box>
          <Box>
            <h2 className="subTitle"> Deseja mostrar sua playlist ? (Preencha todos os campos)</h2>
            <form onSubmit={(e)=>{
              e.preventDefault();

              const dataForm = new FormData(e.target);

              const comunidade = {
                title: dataForm.get('title'),
                imageUrl: dataForm.get('image'),
                link: dataForm.get('url'),
                creatorplaylist: usuarioAleatorio
              }
        
              if(comunidade.title != '' && comunidade.imageUrl != '' && comunidade.link != ''){
                
                fetch('api/comunidades',{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(comunidade)
                })
                .then(async (response)=>{
                  const comunidadeResponse = await response.json();
                  const comunidadesUploaded = [...comunidades, comunidadeResponse.created ];
                  setComunidades(comunidadesUploaded);
                  e.target.reset();
                })
              }else{
                console.log('Preencha todos os campos da sua playlist')
              }
              
            }}>
              <div>
                <input 
                  placeholder="Nome da sua playlist"
                  name="title"
                  type="text"
                ></input>
              </div>

              <div>
                <input 
                  placeholder="Capa da playlist (URL)"
                  name="image"
                  type="text"
                ></input>
              </div>

              <div>
                <input 
                  placeholder="Link para acesso"
                  name="url"
                  type="text"
                ></input>
              </div>

              <button>
                Criar Playlist
              </button>
            </form>
          </Box>
          <Box>
            <p style={{color:'#ffffff'}}>Deixe uma estrela no projeto do <a style={{color: '#2cc9e6'}} href="https://github.com/Vinicius-Fiorio/musickut">github</a> para entrar na lista das pessoas que gostaram</p>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelations title="Playlists" type="comunity" items={comunidades}></ProfileRelations>

          <ProfileRelations title="Criaram uma playlist" type="followers" items={seguidores}></ProfileRelations>

          <ProfileRelations title="Gostaram do Projeto" type="people" items={pessoasFavoritas}></ProfileRelations>

        </div>
      </MainGrid>
    </>
  )
}

//Server

export async function getServerSideProps(context){
  const cookies = nookies.get(context);
  nookies.destroy(null, )
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
      }
  })
  .then((resposta) => resposta.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}
