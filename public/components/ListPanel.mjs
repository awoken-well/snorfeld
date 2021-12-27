import Catalogue  from './Catalogue.mjs'

// web component
class ListPanel extends HTMLElement {
    constructor() {
      super()
      this.ul = document.createElement('ul')
      this.selected = null
    }  

    fragmentCreated(f) {
      let c = Catalogue.getOrderedList()

      c.forEach((cf,idx) => {
        console.log(cf.path, f.path, idx)
        if (cf.path == f.path) {
          let lis = this.querySelectorAll('li')
          let li = this.renderListItem(f)
          if (lis.length === 0 || lis.length === idx) {
            this.ul.appendChild(li)
          } else {
            lis[idx].insertAdjacentElement('beforebegin', this.renderListItem(f))
          }
        }
      })
    }

    fragmentUpdated(f) {
      this.querySelector(`li[path="${f.path}"]`).replaceWith(this.renderListItem(f))
    }

    fragmentDeleted(p) {
      this.querySelector(`li[path="${p}"]`).remove()
    }

    fragmentListed(c) {
        this.ul.innerHTML = ''

        c = Catalogue.getOrderedList()
        c.forEach(f => {
            this.ul.appendChild(this.renderListItem(f))
        })
    }

    fragmentSelected(f) {
      const path = f.path
      this.selected = f
      this.querySelectorAll('li').forEach(el => el.removeAttribute('selected'))
      this.querySelector(`li[path="${path}"]`).setAttribute('selected', 'true')
    }

    renderListItem(f) {
      let li = document.createElement('li')
      li.setAttribute('path', f.path)
      li.innerText = f.meta.filename
      li.addEventListener('click',(e)=>{
        document.body.dispatchEvent(
          new CustomEvent('fragment:selected', {detail: f})
        )
      })
      if (this.selected && this.selected.path == f.path) {
        li.setAttribute('selected','true')
      }
      return li
    }

    // connect component
    connectedCallback() {
        
        let header = document.createElement('header')
        header.innerHTML = `<span class="title"></span>`
        this.appendChild(header)
        this.appendChild(this.ul)
      
        // listen to events
        document.body.addEventListener('fragment:selected', (e)=>{
          this.fragmentSelected(e.detail)
        })          

        document.body.addEventListener('fragment:listed', (e)=>{
          this.fragmentListed(e.detail)
        })          

        document.body.addEventListener('fragment:created', (e)=>{
          this.fragmentCreated(e.detail)
        })          

        document.body.addEventListener('fragment:updated', (e)=>{
          this.fragmentUpdated(e.detail)
        })          

        document.body.addEventListener('fragment:deleted', (e)=>{
          this.fragmentDeleted(e.detail)
        })          

      }
    
}
  
// register component
customElements.define( 'list-panel', ListPanel );

export default ListPanel
