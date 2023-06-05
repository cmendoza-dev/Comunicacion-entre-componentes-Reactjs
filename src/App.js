import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      pos: null,
      titulo: 'Nuevo',
      id: null, // Cambia 0 a null
      nombre: '',
      fecha: '',
      rating: 0,
      categoria: ''
    };
    

    this.cambioNombre = this.cambioNombre.bind(this);
    this.cambioFecha = this.cambioFecha.bind(this);
    this.cambioRating = this.cambioRating.bind(this);
    this.cambioCategoria = this.cambioCategoria.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/series/')
      .then(res => {
        this.setState({ series: res.data });
      })
      .catch(error => {
        console.log(error.toString());
      });
  }

  cambioNombre(e) {
    this.setState({
      nombre: e.target.value
    });
  }

  cambioFecha(e) {
    this.setState({
      fecha: e.target.value
    });
  }

  cambioCategoria(e) {
    this.setState({
      categoria: e.target.value
    });
  }

  cambioRating(e) {
    this.setState({
      rating: parseInt(e.target.value)
    });
  }

  mostrar(cod, index) {
    axios.get('http://127.0.0.1:8000/series/' + cod + '/')
      .then(res => {
        this.setState({
          pos: index,
          titulo: 'Editar',
          id: res.data.id,
          nombre: res.data.name,
          fecha: res.data.release_date,
          rating: res.data.rating,
          categoria: res.data.category
        });
      })
      .catch(error => {
        console.log(error.toString());
      });
  }

  guardar(e) {
    e.preventDefault();
    const cod = this.state.id;
    const datos = {
      name: this.state.nombre,
      release_date: this.state.fecha,
      rating: this.state.rating,
      category: this.state.categoria
    };
    if (cod !== null) { // Cambia la verificación de cod > 0 a cod !== null
      axios.put('http://127.0.0.1:8000/series/' + cod + '/', datos)
        .then(res => {
          const indx = this.state.pos;
          const temp = [...this.state.series];
          temp[indx] = res.data;
          this.setState({
            pos: null,
            titulo: 'Nuevo',
            id: 0,
            nombre: '',
            fecha: '',
            rating: 0,
            categoria: '',
            series: temp
          });
        })
        .catch(error => {
          console.log(error.toString());
        });
    } else {
      axios.post('http://127.0.0.1:8000/series/', datos)
        .then(res => {
          const temp = [...this.state.series, res.data];
          this.setState({
            id: 0,
            nombre: '',
            fecha: '',
            rating: 0,
            categoria: '',
            series: temp
          });
        })
        .catch(error => {
          console.log(error.toString());
        });
    }
  }

  eliminar(cod) {
    const rpta = window.confirm('¿Desea eliminar?');
    if (rpta) {
      axios.delete('http://127.0.0.1:8000/series/' + cod + '/')
        .then(res => {
          const temp = this.state.series.filter(serie => serie.id !== cod);
          this.setState({
            series: temp
          });
        })
        .catch(error => {
          console.log(error.toString());
        });
    }
  }

  render() {
    return (
      <div className='container mt-3 w-50'>
        <h1 className='mb-3'>Lista de Series</h1>
        <table border="1" className='table table-striped table-hover'>
          <thead className='text-center'>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
              <th>Rating</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.series.map((serie, index) => (
              <tr key={serie.id}>
                <td>{serie.name}</td>
                <td className='text-center'>{serie.release_date}</td>
                <td className='text-center'>{serie.rating}</td>
                <td className='text-center'>{serie.category}</td>
                <td className=' d-flex justify-content-center'>
                  <button className='btn btn-success mx-2' onClick={() => this.mostrar(serie.id, index)}>Editar</button>
                  <button className='btn btn-danger' onClick={() => this.eliminar(serie.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <h1>{this.state.titulo}</h1>
        <form onSubmit={this.guardar} >
          <input  type='hidden' value={this.state.id} />
          <p>
            Ingrese nombre:
            <input className='form-control' type='text' value={this.state.nombre} onChange={this.cambioNombre} />
          </p>
          <p>
            Ingrese Rating:
            <input className='form-control' type='number' value={this.state.rating} onChange={this.cambioRating} />
          </p>
          <p>
            Categoría:
            <input className='form-control' type='text' value={this.state.categoria} onChange={this.cambioCategoria} />
          </p>
          <p>
            Fecha:
            <input className='form-control' type='text' value={this.state.fecha} onChange={this.cambioFecha} />
          </p>
          <p><input className='btn btn-primary' type='submit' value="Enviar" /></p>
        </form>
      </div>
    );
  }
}

export default App;
