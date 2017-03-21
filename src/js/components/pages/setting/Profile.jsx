import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import _ from 'lodash'

import FormField from 'grommet/components/FormField'

import { Modal, Input } from 'antd'

export default CSSModules(class extends Component {
    constructor (props) {
        super(props)
        this.updatePropsToState = this.updatePropsToState.bind(this)
        this.changeFilterInput = this.changeFilterInput.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.showModal = this.showModal.bind(this)
        this.state = {
            id: -1,
            nickName: '',
            newNickName: '',
            visible: false
        }
    }
    showModal () {
        this.setState({
            visible: true
        })
    }
    handleOk (e) {
        console.log('handle ok: ', this.state.newNickName)
        this.props.setNickName(this.state.id, this.state.newNickName)
        .then(() => {
            this.props.getNickName(this.state.id)
        })
        .then(() => {
            this.setState({
                newNickName: '',
                visible: false
            })
        })
    }
    handleCancel (e) {
        console.log('cancel', this.state)
        this.setState({
            newNickName: '',
            visible: false
        })
    }
    changeFilterInput (event) {
        this.setState({newNickName: event.target.value})
    }
    componentDidMount () {
        console.log('[state] did mount')
        console.log(this.props.Session.AuthData)
        if (_.size(this.props.Session.AuthData) === 0) {
            console.log('not yet')
            return
        }
        console.log('did mount: get')
        this.props.getNickName(this.props.Session.AuthData.uid)
    }
    updatePropsToState (newProps) {
        console.log(newProps)
    }
    componentDidUpdate () {
        console.log('[state] did update')
        // this.setState({ nickName: this.props.Profile.nickName })
        if (this.state.id !== this.props.Session.AuthData.uid) {
            this.setState({
                id: this.props.Session.AuthData.uid
            }, () => {
                this.props.getNickName(this.props.Session.AuthData.uid)
                .then(() => {
                    console.log(this.props.Profile.nickName)
                    this.setState({ nickName: this.props.Profile.nickName })
                })
            })
        }

        if (this.state.nickName !== this.props.Profile.nickName) {
            this.setState({ nickName: this.props.Profile.nickName })
        }
    }
    componentWillReceiveProps (nextProps) {
        console.log('[state] will receive')
        this.updatePropsToState(nextProps)
    }
    render () {
        return (
            <div>
                <Modal title="修改暱稱" visible={this.state.visible}
                  onOk={this.handleOk} onCancel={this.handleCancel}
                  footer={[]}>
                    <FormField label='更改暱稱'>
                        <Input rows={1}
                            size="large"
                            type="text"
                            placeholder=""
                            value={this.state.newNickName}
                            onChange={(event) => { this.setState({newNickName: event.target.value}) }}
                            onPressEnter={this.handleOk}
                            style={{borderRadius: '5px', fontSize: '20px'}} />
                    </FormField>
                    <div className="btnContainer">
                        <div onClick={this.handleCancel}>放棄修改 cancel</div>
                        <div onClick={this.handleOk}>確定修改 confirm</div>
                    </div>
                </Modal>
                <div>
                    Hello: {this.props.Session.AuthData.displayName} 你的暱稱: {this.state.nickName}
                </div>
                <br />
                <div onClick={this.showModal}>點此修改暱稱</div>
            </div>
        )
    }
}, require('./Profile.styl'))
