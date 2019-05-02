import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      templates: [],
      template: '',
      members: [],
      index: 0,
    }
    this.changeTemplate = this.changeTemplate.bind(this)
  }

  componentDidMount() {
    const templates = window.messageTemplates
    this.setState({ members: window.members, templates, template: templates[0].body })
  }

  changeTemplate(evt) {
    this.setState({ template: evt.target.value })
  }

  sendSms(name, number) {
    let body = escape(
      this.state.template
        .trim()
        .replace('NAME', name.split(' ')[0])    // first name
        .replace('PHONE', window.phone)
    )
    console.log(`sms://${number}&body=${body}`)
    document.location.href = `sms://${number}&body=${body}`
  }

  callNumber(number) {
    document.location.href = `tel://${number}`
  }

  render() {
    let rows = this.state.members.map((m, i) =>
      <tr key={m.name}>
        <td>{i + 1}. {m.name}</td>
        <td>
          <button className='btn btn-outline-primary btn-sm'
            onClick={this.sendSms.bind(this, m.name, m.phone)}>text</button>
          <button className='btn btn-outline-primary btn-sm'
            onClick={this.callNumber.bind(this, m.phone)}>call</button>
        </td>
      </tr>
    )

    return <div>
      <select value={this.state.index} onChange={evt => {
        const index = evt.target.value
        this.setState({ index, template: this.state.templates[index].body })
      }}>
        {this.state.templates.map((template, index) =>
          <option
            key={template.name}
            value={index}
          >{template.name}</option>
        )}
      </select>
      <textarea
        id='message-template'
        readOnly
        rows='4'
        value={this.state.template} />

      <p>{this.state.members.length} members</p>

      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('main'))
