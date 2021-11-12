import React, { Component } from 'react';
import Triangulo from './img/triangulo.png';
import Logo from './img/americanas_logo.png';
import Lupa from './img/lupa.png'
import './App.css';
import AutoCompleteApi from './API/autoCompleteApi';
import ProdutoApi from "./API/ProdutoApi"
import { Divider, Button, Popper } from '@material-ui/core/';
class App extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      produtos: [],
      produtoID: false,
      sugestao: false,
      lista: (<> </>),
      lista2: (<> </>),
      anchor: false,
      open: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getProdutos = this.getProdutos.bind(this);
    this.sugestoesFn = this.sugestoesFn.bind(this);
    this.autoComplete = this.autoComplete.bind(this);
  }
  async sugestoesFn() {
    clearTimeout(DelayPesquisa)
    DelayPesquisa = setTimeout(() => { this.autoComplete() }, 1000)
  }
  async handleSubmit(e) {
    e.preventDefault();
    const value = this.state.value;
    const item = this.state.produtoID;
    if (value) {
      window.location = ('https://www.americanas.com.br/produto/' + item)
    }
  }
  async getProdutos(props1, props2, props3) {
    const { data } = await ProdutoApi.get(`&id=${props1}&id=${props2}&id=${props3}`);
    return (data.product.result)
  }
  handleChange(e) {
    this.setState({ value: e.target.value, anchor: e.currentTarget })
    this.sugestoesFn()
  }
  async autoComplete() {
    const value = this.state.value
    if (value) {
      try {
        const response = await AutoCompleteApi.get(`autocomplete?content=${value}&suggestionLimit=7&productLimit=3&source=nanook`);
        const { data } = response
        if (data.products.length === 0) {
          console.log('sem produtos')
          this.setState({ produtos: [], produtoID: false, sugestao: false, lista: false, lista2: false })
        } else {
          const produtos = data.products
          const sugestao = data.suggestions
          const produtosComImagem = await this.getProdutos(produtos[0]['id'], produtos[1]['id'], produtos[2]['id'])
          const ProductImages = (produtosComImagem.map((x) => { return x.images[0].small }))
          const productList = produtos.map((item, indice) => {
            return <div id={item.id.toString()} key={item.id.toString()} className="ProductSugestion"
              onClick={() => window.location = ('https://www.americanas.com.br/produto/' + item.id)}>
              <li key={item.id}><div className="produtoImage" key={item.id + 99} ><img src={ProductImages[indice]} alt="produto" /></div> {(item['name'])} </li> </div>
          })
          const suggestionMap = sugestao.map((item, indice) => {
            return <div id={indice.toString()} key={indice.toString()} className="SuggestionSelect"
              onClick={() => window.location = ('https://www.americanas.com.br/busca/' + item['term'])}><li key={indice}>
                {(item['term'])}</li></div>
          })
          const productNameList = produtos.map((item) => { return (item.name) });
          this.setState({ open: true, produtos: productNameList, produtoID: produtos[0]['id'], sugestao: sugestao, lista: productList, lista2: suggestionMap })
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log('sem produtos')
      this.setState({ open: false, produtos: [], produtoID: false, sugestao: false, lista: false, lista2: false })
    }
  }
  render() {
    return (
      <div className="App">
        <div className='App-header'>          
        <img src={Logo} alt="AMERICANAS" />
          <div className='Seek-bar'>
            <form onSubmit={this.handleSubmit}>
              <input
                className="Input-seek-bar"
                value={this.state.value}
                onChange={this.handleChange}
              />
              <Button 
              onClick={this.handleSubmit}
              size='small'
              endIcon={<img src={Lupa} alt="lupa"
              width='24' height='24'
              />} 
              />
            </form>
          </div>
          <Popper id="mostruario" open={this.state.open} anchorEl={this.state.anchor} className="Popper">
          <img src={Triangulo} alt="setinha" />
            <div className="boxPopper">
              <div className="Auto-complete">
                <div className="Suggestion">
                  <div className="suggestionTitulo">Sugestões</div>
                  <Divider />
                  {this.state.lista2}
                </div>
                <div className="Suggestion">
                  <div className="produtosTitulo">Produtos Sugeridos
                    <Divider /></div>
                  <div className="ProductList">
                    {this.state.lista}
                  </div>
                </div>
              </div>
            </div>
          </Popper>          
        </div>
        <div className="conteudo">          
        </div>
      </div>
    );
  }
}
var DelayPesquisa;
export default App;
