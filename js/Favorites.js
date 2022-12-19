import { GithubUser } from "./GithubUser.js"

GithubUser

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  save() {
    localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      
      const userExists = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())

      console.dir(userExists)

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      
      if(user.login === undefined) {
        throw new Error('Usuário não existe')
      }
      
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      
    } catch(error) {
      alert(error.message)
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }
  
  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
    const tbody = document.querySelector('#container-table')
    if(this.entries.length === 0) {
      tbody.classList.add('active')
    } else {
      tbody.classList.remove('active')
    }

    this.removeAllTr()
    
    
    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositorios').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      row.querySelector('.user a').href = `https://github.com/${user.login}`

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        if(isOk){
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()})
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `          
      <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
        <a target = "_blank" href="">
          <p>Mayk Brito</p>
          <span>/maykbrito</span>
        </a>
      </td>

      <td class="repositorios">
        123
      </td>

      <td class="followers">
        1234
      </td>

      <td class="action">
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }
}