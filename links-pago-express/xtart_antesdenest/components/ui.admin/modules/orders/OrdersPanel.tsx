import React, { FC } from 'react'
import { Card, Stack } from 'react-bootstrap'

export const OrdersPanel: FC = () => {
    
    return (
        <Card >
            <Card.Body className='px-0 py-2'>
                <Stack direction='horizontal' >

                </Stack>
                <div className="vstack d-flex flex-row justify-content-between align-items-center">
                    <button className="btn d-flex align-items-center p-0 m-1" type="button">
                        <span className="text-start" style={{fontWeight: 'bold'}}>Por enviar: 10</span>
                        <i className="material-icons">chevron_right</i>
                    </button>
                    <button className="btn d-flex align-items-center p-0 m-1" type="button">
                        <span className="text-start" style={{fontWeight: 'bold'}}>Por pagar: 10</span>
                        <i className="material-icons">chevron_right</i>
                    </button>
                    <div />
                    <button className="btn d-flex align-items-center p-0 m-1" type="button">
                        <span className="text-start" style={{fontWeight: 'bold'}}>Ordenes totales: 1</span>
                        <i className="material-icons">chevron_right</i>
                    </button>
                </div>
                <div className="vstack d-flex flex-row justify-content-between align-items-center">
                    <div className="input-group my-2">
                        <span className="input-group-text">Buscar</span>
                        <input className="form-control" type="text" />
                        <div className="dropdown">
                            <button className="btn btn-primary dropdown-toggle rounded-0" aria-expanded="false" data-bs-toggle="dropdown" type="button">
                                SELECCIONAR
                            </button>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="#">First Item</a>
                                <a className="dropdown-item" href="#">Second Item</a>
                                <a className="dropdown-item" href="#">Third Item</a>
                            </div>
                        </div>
                        <button className="btn btn-primary d-lg-flex align-items-lg-center" type="button">
                            <i className="material-icons">search</i>
                        </button>
                    </div>
                </div>
                <div className="hstack gap-0">
                    <div className="col text-bg-primary col-3">
                    <h6 className="d-lg-flex align-items-lg-center">Identificador</h6>
                    </div>
                    <div className="col text-bg-primary col-2">
                    <h6 className="d-lg-flex align-items-lg-center">Resumen</h6>
                    </div>
                    <div className="col text-bg-primary col-1">
                    <h6 className="d-lg-flex align-items-lg-center">Estatus</h6>
                    </div>
                    <div className="col text-bg-primary col-6">
                    <h6 className="text-center d-lg-flex justify-content-lg-center align-items-lg-center">Acciones</h6>
                    </div>
                </div>
                <div className="hstack gap-0 d-lg-flex align-items-lg-center" style={{borderTop: '2px solid var(--bs-gray-400)', borderBottom: '2px solid var(--bs-gray-400)'}}>
                    <div className="col col-3">
                    <div className="card" style={{borderStyle: 'none'}}>
                        <div className="card-body d-flex flex-column p-0 m-0" data-bs-toggle="tooltip" data-bss-tooltip title="Orden de Venta <br /> IDSO: {{ ID_SO }}" data-bs-html="true">
                        <h5 className="fw-bold d-xl-flex card-title p-0 m-0" style={{fontSize: '0.9rem'}}># 1</h5>
                        <p className="p-0 m-0" style={{fontSize: '0.9rem'}}>ECO-FEDE200-00008</p>
                        <p className="text-secondary p-0 m-0" style={{fontSize: '0.7rem'}}><span style={{backgroundColor: 'rgb(248, 249, 250)'}}>Capturo: MIGSJ</span></p>
                        <p data-bs-toggle="tooltip" data-bss-tooltip className="p-0 m-0" style={{fontSize: '0.7rem'}} title="Fecha de la orden de venta"><strong><span style={{backgroundColor: 'rgb(248, 249, 250)'}}>Creacion:</span></strong><span style={{backgroundColor: 'rgb(248, 249, 250)'}}>&nbsp;1/31/23, 12:00AM</span></p>
                        <p data-bs-toggle="tooltip" data-bss-tooltip className="p-0 m-0" style={{fontSize: '0.7rem'}} title="Fecha de la ultima actualizacion"><strong><span style={{backgroundColor: 'rgb(248, 249, 250)'}}>Cambios:</span></strong><span style={{backgroundColor: 'rgb(248, 249, 250)'}}>&nbsp;2/23/23, 12:00AM</span></p>
                        </div>
                    </div>
                    </div>
                    <div className="col d-flex col-2">
                    <div className="card" style={{borderStyle: 'none'}}>
                        <div className="card-body d-flex flex-column p-0 m-0" data-bs-toggle="tooltip" data-bss-tooltip title="Resumen de la orden" data-bs-html="true">
                        <p className="p-0 m-0" style={{fontSize: '0.9rem'}}>SKUs: 2</p>
                        <p className="p-0 m-0" style={{fontSize: '0.9rem'}}>QTY: 345</p>
                        <p className="p-0 m-0" style={{fontSize: '0.9rem'}}>&nbsp;</p>
                        <p className="p-0 m-0" style={{fontSize: '0.9rem'}}>Subtotal: $23.245.00</p>
                        </div>
                    </div>
                    </div>
                    <div className="col col-1">
                    <div className="card" style={{borderStyle: 'none'}}>
                        <div className="card-body d-flex flex-column p-0 my-1"><small style={{fontSize: '0.8rem'}}>Pago</small><span className="badge bg-secondary" data-bs-toggle="tooltip" data-bss-tooltip title="Estatus del envio" style={{fontSize: '0.6rem'}}>PENDIENTE</span>
                        <div style={{height: '10px'}} /><small style={{fontSize: '0.8rem'}}>Envio</small><span className="badge bg-secondary" data-bs-toggle="tooltip" data-bss-tooltip title="Estatus del pago" style={{fontSize: '0.6rem'}}>PENDIENTE</span>
                        </div>
                    </div>
                    </div>
                    <div className="col col-6">
                    <div className="card mx-3" style={{borderStyle: 'none'}}>
                        <div className="card-body p-0 m-0"><div className="d-flex flex-row align-items-center p-0 m-0">
                            <button id="btncpy-{{ hashPermLink ID_SO }}" className="btn btn-sm btn-primary" data-bs-container="body" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="Enlace copiado al portapapeles">
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                            </svg>
                            </button>
                            <div className="mx-3" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="Estatus de la orden de venta">
                            <span className="badge text-bg-danger">CANCELADA</span>
                            </div>
                            <div className="d-flex flex-row align-items-center w-75">
                            <select id="selectexe-{{ hashPermLink ID_SO }}" className="form-select form-select-sm w-75" aria-label=".form-select-sm">
                                <option value="s" selected>Selecciona</option>
                                {'{'}{'{'}#each actions{'}'}{'}'}
                                <option value="op-{{this}}-{{ hashPermLink ../ID_SO }}">{'{'}{'{'}this{'}'}{'}'}</option>
                                {'{'}{'{'}/each{'}'}{'}'}
                            </select>
                            <button id="btnexe-{{ hashPermLink ID_SO }}" type="button" className="btn btn-sm btn-success" data-bs-toggle="tooltip" data-bs-title="Aplicar accion">
                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                                </svg>
                            </button>
                            </div>
                        </div></div>
                    </div>
                    </div>
                </div>
                
            </Card.Body>
        </Card>
    )
}
