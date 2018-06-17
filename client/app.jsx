import React from 'react'
import ReactDOM from 'react-dom'

const TEMPLATE = `
Hi NAME, this is your captain, Feihong. We're going to get in the boat at 11:00 am.
If you're having problems finding the practice site at 1020 W. Weed St., call me at PHONE.
`.trim().replace('\n', ' ')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      template: TEMPLATE,
      members: [],
    }
    this.changeTemplate = this.changeTemplate.bind(this)
  }

  componentDidMount() {
    this.setState({members: window.members})
  }

  changeTemplate(evt) {
    this.setState({template: evt.target.value.strip()})
  }

  sendSms(name, number) {
    let body = escape(
      this.state.template
        .replace('NAME', name.split(' ')[0])
        .replace('PHONE', window.phone)
    )
    console.log(`sms://${number}&body=${body}`)
    document.location.href = `sms://${number}&body=${body}`
  }

  callNumber(number) {
    document.location.href = `tel://${number}`
  }

  render() {
    let rows = this.state.members.map(m =>
      <tr key={m.name}>
        <td>{m.name}</td>
        <td>
          <button className='btn btn-outline-primary btn-sm'
                  onClick={this.sendSms.bind(this, m.name, m.phone)}>text</button>
          <button className='btn btn-outline-primary btn-sm'
                  onClick={this.callNumber.bind(this, m.phone)}>call</button>
        </td>
      </tr>
    )

    return <div>
      <textarea id='message-template'
                rows='4'
                onChange={this.changeTemplate}
                value={this.state.template} />

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

ReactDOM.render(<App/>, document.getElementById('main'))
