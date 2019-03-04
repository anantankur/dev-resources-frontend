import React from 'react';
import './resHeader.css'

const ResHeader = ({ res }) => {
    
    const fallbackImage = (e) => {
        e.target.src = `https://via.placeholder.com/1500/2e303a/FFFFFF/?text=No%20Image%20Found`
    }
    
    return (
        <div className="resHeader">
                <div className="row">
                    <div className="col-md-2">
                        <img className="img-fluid" src={res.meta.image} alt={`${res.meta.title} Thumbnail`} onError={fallbackImage}/>
                    </div>
                    <div className="col-md-10">
                        <a href={res.link}><h1>{res.meta.title}</h1></a>
                        <a href={res.link}><p><i className="fas fa-link"></i> {res.link}</p></a>
                        <button className="btn btn-outline-warning">Tag 1</button>
                        <button className="btn btn-outline-warning">Tag 2</button>
                        <button className="btn btn-outline-warning">Tag 3</button>
                        <button className="btn btn-outline-warning"><i className="fas fa-plus"></i> 3 More</button>
                    </div>
                </div>
            </div>
    )
};

export default ResHeader;