import React, { Component } from 'react'

export default class Help extends Component {
    render() {
        return (
            <div className="modal" id="helpModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
