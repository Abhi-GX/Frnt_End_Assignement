import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
const CarInventory = () => {
    const [cars, setCars] = useState([]);
    const [suggestions, setSuggestions] = useState(['bmw', 'audi', 'ford', 'toyota', 'honda']);
    const [searchQuery, setSearchQuery] = useState('bmw');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(null);
    const [totalElements, setTotalElements] = useState(null);
    const debounceRef = useRef(null);
    async function getCars(query, pageArg = null, sizeArg = null) {
       
        const p = typeof pageArg === 'number' ? pageArg : page;
        const s = typeof sizeArg === 'number' ? sizeArg : size;
        const start = p * s;

        const body = {
            query: [query],
            filter: {},
            sort: [
                'salelight_priority asc',
                'member_damage_group_priority asc',
                'auction_date_type desc',
                'auction_date_utc asc',
            ],
            page: p,
            size: s,
            start: start,
            watchListOnly: false,
            freeFormSearch: true,
            hideImages: false,
            defaultSort: false,
            specificRowProvided: false,
            displayName: '',
            searchName: '',
            backUrl: '',
            includeTagByField: {},
            rawParams: {},
        };

        try {
            const response = await axios.post(
                '/public/lots/search-results',
                body,
                {
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Access-Control-Allow-Headers': 'Content-Type, X-XSRF-TOKEN',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': '6288c724-c79d-479d-a767-3ee5d0ee0d7b',
                    },
                    withCredentials: true,
                    timeout: 20000,
                }
            );

            
            console.log('Search response:', response);
            const resp = response.data || {};

            // Try to extract paginated list content from common shapes
            const content = resp?.results?.content ?? resp?.data?.results?.content ?? resp?.data ?? resp?.rows ?? resp?.results ?? resp;
            const list = Array.isArray(content) ? content : (Array.isArray(content?.content) ? content.content : []);
            setCars(list);

            // Update pagination info when available
            const tp = resp?.results?.totalPages ?? resp?.data?.totalPages ?? resp?.totalPages;
            const te = resp?.results?.totalElements ?? resp?.data?.totalElements ?? resp?.totalElements ?? resp?.totalCount ?? null;
            setTotalPages(typeof tp === 'number' ? tp : (tp ? Number(tp) : null));
            setTotalElements(typeof te === 'number' ? te : (te ? Number(te) : null));
            // sync page/size with what we requested
            setPage(p);
            setSize(s);
        } catch (e) {
            console.error('getCars error:', e.response?.data || e.message || e);
        }
    }
    async function getCopartSuggestions(query) {
        if (!query || query.length < 1) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const url = '/public/data/lots/suggest';
        const data = qs.stringify({ q: query });

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                withCredentials: true,
                timeout: 10000,
            });

            const resp = response?.data || {};
            const s = resp.suggestions || resp || [];
            setSuggestions(Array.isArray(s) ? s : []);
            setShowSuggestions(true);
            console.log('Suggestions response:', resp);
        } catch (error) {
            console.error('Suggestions error:', error.response?.data || error.message || error);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    useEffect(() => {
        try {
            // Initial load example — you may remove or replace with an empty load
            // getCopartSuggestions(searchQuery);
            getCars(searchQuery);
            // setCars([
            //     { id: 1, make: 'Toyota', model: 'Camry', year: 2020 },
            //     { id: 2, make: 'Honda', model: 'Accord', year: 2019 },
            //     { id: 3, make: 'Ford', model: 'Mustang', year: 2021 },
            // ]);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const OnChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);

        // Debounce suggestions to avoid too many requests
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            getCopartSuggestions(value);
        }, 300);
    };

    const handleSearch = () => {
        // reset to first page when performing a new search
        setPage(0);
        getCars(searchQuery, 0, size);
    }
    const handlePrev = () => {
        if (page <= 0) return;
        const nextPage = page - 1;
        setPage(nextPage);
        getCars(searchQuery, nextPage, size);
    };
    const handleNext = () => {
        // if totalPages known, don't go beyond it
        if (totalPages != null && page >= totalPages - 1) return;
        const nextPage = page + 1;
        setPage(nextPage);
        getCars(searchQuery, nextPage, size);
    };
    const handleSuggestionClick = (s) => {
        // suggestion might be a string like 'Audi Q5' or an object; handle both
        const value = typeof s === 'string' ? s.trim() : (s.displayName || s.text || JSON.stringify(s));
        setSearchQuery(value);
        setShowSuggestions(false);
        getCars(value);
    };
    return (
        <div style={{
            minHeight: '100vh',
            padding: '24px',
            background: 'var(--bg-primary, #f5f7fa)',
            color: 'var(--text-primary, #1a202c)',
            transition: 'background 0.3s ease'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>Car Inventory</h1>
                    <p style={{
                        margin: 0,
                        color: 'var(--text-secondary, #718096)',
                        fontSize: '14px'
                    }}>Search and explore thousands of vehicles</p>
                </div>

                

                {/* Search Section */}
                <div style={{
                    position: 'relative',
                    maxWidth: '700px',
                    marginBottom: '32px',
                    marginLeft: '24px',
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        background: 'var(--bg-card, #ffffff)',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid var(--border-color, #e2e8f0)'
                    }}>
                        <input
                            type="text"
                            placeholder="Search by make, model, or keyword..."
                            value={searchQuery}
                            onChange={OnChange}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                background: 'var(--bg-input, #f7fafc)',
                                color: 'var(--text-primary, #1a202c)',
                                transition: 'all 0.2s'
                            }}
                            onFocus={(e) => e.target.style.background = 'var(--bg-input-focus, #edf2f7)'}
                            onBlur={(e) => e.target.style.background = 'var(--bg-input, #f7fafc)'}
                        />
                        <button
                            onClick={handleSearch}
                            style={{
                                padding: '12px 28px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            Search
                        </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute',
                            zIndex: 50,
                            background: 'var(--bg-card, #ffffff)',
                            listStyle: 'none',
                            margin: '8px 0 0 0',
                            padding: '8px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                            width: 'calc(100% - 16px)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color, #e2e8f0)',
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            {suggestions.map((s, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        padding: '10px 12px',
                                        cursor: 'pointer',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        color: 'var(--text-primary, #2d3748)',
                                        transition: 'background 0.15s'
                                    }}
                                    onClick={() => handleSuggestionClick(s)}
                                    onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover, #edf2f7)'}
                                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                >
                                    🔍 {typeof s === 'string' ? s : (s.displayName || s.text || JSON.stringify(s))}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Results Count */}
                {cars.length > 0 && (
                    <div style={{
                        marginBottom: '20px',
                        fontSize: '14px',
                        color: 'var(--text-secondary, #718096)',
                        fontWeight: '500'
                    }}>
                        Found {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'}
                    </div>
                )}

                {/* Cars Grid */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginTop: '24px',
                    width: '100%',
                    alignItems: 'stretch'
                }}>
                    {cars.map((lot, i) => {
                        // normalize fields from sample
                        const lotNumber = lot.ln || lot.lotNumber || lot.id || `${i}`;
                        const make = lot.mkn || lot.make || lot.manufacturer || '';
                        const model = lot.lm || lot.model || lot.lmg || '';
                        const trim = lot.mtrim || lot.trim || '';
                        const year = lot.lcy || lot.year || '';
                        const thumbnail = lot.tims || lot.thumbnail || lot.imageUrl || (lot.images && lot.images[0]) || '';
                        const location = lot.yn || lot.locCity || lot.locState || '';
                        const currentBid = lot.hb || lot.currentBid || lot.obc || 0;
                        const buyNow = lot.bnp || lot.buyTodayBid || 0;
                        const title = lot.ld || lot.ldc || `${year} ${make} ${model}`.trim();
                        const damage = lot.dd || lot.damageDescription || '';
                        const odometer = lot.orr || lot.odometer || '';
                        const vin = lot.fv || lot.vin || '';
                        const titleType = lot.tgd || lot.titleType || '';
                        const color = lot.clr || lot.color || '';

                        return (
                            <div
                                key={lotNumber + '_' + i}
                                style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            minWidth: '240px',
                                            flex: '1 1 240px',
                                            boxSizing: 'border-box',
                                            background: 'var(--bg-card, #ffffff)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            border: '1px solid var(--border-color, #e2e8f0)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'pointer'
                                        }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                }}
                            >
                                {/* Image */}
                                <div style={{
                                    width: '100%',
                                    height: '160px',
                                    background: 'var(--bg-image, #f0f4f8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt={title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            color: 'var(--text-muted, #a0aec0)',
                                            fontSize: '14px',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚗</div>
                                            <div>No image available</div>
                                        </div>
                                    )}
                                    {/* Year Badge */}
                                    {year && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '8px',
                                            left: '8px',
                                            background: 'rgba(0,0,0,0.75)',
                                            color: '#fff',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backdropFilter: 'blur(8px)'
                                        }}>
                                            {year}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    {/* Title */}
                                    <a href={`https://www.copart.com/lot/${lotNumber}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <h3 style={{
                                        margin: '0 0 6px 0',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: 'var(--text-primary, #1a202c)',
                                        lineHeight: '1.3',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {title || `${make} ${model}`}
                                    </h3>
                                    </a>

                                    {/* Make/Model/Trim */}
                                    <div style={{
                                        color: 'var(--text-secondary, #718096)',
                                        fontSize: '12px',
                                        marginBottom: '10px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {make} {model} {trim && `• ${trim}`}
                                    </div>

                                    {/* Details Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '6px',
                                        marginBottom: '10px',
                                        padding: '8px',
                                        background: 'var(--bg-details, #f7fafc)',
                                        borderRadius: '6px'
                                    }}>
                                        <div style={{ fontSize: '11px' }}>
                                            <div style={{ color: 'var(--text-muted, #a0aec0)', marginBottom: '2px' }}>Lot #</div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-primary, #2d3748)', fontSize: '10px' }}>{lotNumber}</div>
                                        </div>
                                        <div style={{ fontSize: '11px' }}>
                                            <div style={{ color: 'var(--text-muted, #a0aec0)', marginBottom: '2px' }}>Location</div>
                                            <div style={{ 
                                                fontWeight: '600', 
                                                color: 'var(--text-primary, #2d3748)', 
                                                fontSize: '10px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{location || 'N/A'}</div>
                                        </div>
                                        {odometer && (
                                            <div style={{ fontSize: '11px' }}>
                                                <div style={{ color: 'var(--text-muted, #a0aec0)', marginBottom: '2px' }}>Odometer</div>
                                                <div style={{ fontWeight: '600', color: 'var(--text-primary, #2d3748)', fontSize: '10px' }}>{odometer.toLocaleString()} mi</div>
                                            </div>
                                        )}
                                        {color && (
                                            <div style={{ fontSize: '11px' }}>
                                                <div style={{ color: 'var(--text-muted, #a0aec0)', marginBottom: '2px' }}>Color</div>
                                                <div style={{ 
                                                    fontWeight: '600', 
                                                    color: 'var(--text-primary, #2d3748)', 
                                                    fontSize: '10px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>{color}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Damage Tags */}
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        {titleType && (
                                            <span style={{
                                                fontSize: '10px',
                                                padding: '3px 6px',
                                                background: titleType.toLowerCase().includes('clean') ? 'rgba(72, 187, 120, 0.15)' : 'rgba(237, 137, 54, 0.15)',
                                                color: titleType.toLowerCase().includes('clean') ? '#2f855a' : '#c05621',
                                                borderRadius: '4px',
                                                fontWeight: '600'
                                            }}>
                                                {titleType}
                                            </span>
                                        )}
                                        {damage && (
                                            <span style={{
                                                fontSize: '10px',
                                                padding: '3px 6px',
                                                background: 'rgba(160, 174, 192, 0.15)',
                                                color: 'var(--text-secondary, #4a5568)',
                                                borderRadius: '4px',
                                                fontWeight: '500',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '100%'
                                            }}>
                                                {damage}
                                            </span>
                                        )}
                                    </div>

                                    {/* Pricing */}
                                    <div style={{
                                        borderTop: '1px solid var(--border-color, #e2e8f0)',
                                        paddingTop: '10px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 'auto'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '10px',
                                                color: 'var(--text-muted, #a0aec0)',
                                                marginBottom: '2px'
                                            }}>Current Bid</div>
                                            <div style={{
                                                fontSize: '15px',
                                                fontWeight: '700',
                                                color: '#667eea'
                                            }}>
                                                {currentBid ? `$${currentBid.toLocaleString()}` : 'No bids'}
                                            </div>
                                        </div>
                                        {buyNow > 0 && (
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{
                                                    fontSize: '10px',
                                                    color: 'var(--text-muted, #a0aec0)',
                                                    marginBottom: '2px'
                                                }}>Buy Now</div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    color: '#48bb78'
                                                }}>
                                                    ${buyNow.toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {cars.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        color: 'var(--text-secondary, #718096)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: '0 0 8px 0',
                            color: 'var(--text-primary, #2d3748)'
                        }}>No vehicles found</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>Try searching for a different make or model</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {cars.length > 0 && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '20px',
                        gap: '12px'
                    }}>
                        <button
                            onClick={handlePrev}
                            disabled={page <= 0}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color, #e2e8f0)',
                                background: page <= 0 ? 'var(--bg-disabled, #f7fafc)' : 'var(--bg-card, #ffffff)',
                                color: page <= 0 ? 'var(--text-muted, #a0aec0)' : 'var(--text-primary, #1a202c)',
                                cursor: page <= 0 ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Prev
                        </button>

                        <div style={{ flex: 1, textAlign: 'center', color: 'var(--text-secondary, #718096)', fontSize: '13px' }}>
                            Page {page + 1}{totalPages ? ` of ${totalPages}` : ''}{totalElements ? ` — ${totalElements} results` : ''}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={totalPages != null ? page >= (totalPages - 1) : (cars.length < size)}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color, #e2e8f0)',
                                background: (totalPages != null ? page >= (totalPages - 1) : (cars.length < size)) ? 'var(--bg-disabled, #f7fafc)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: (totalPages != null ? page >= (totalPages - 1) : (cars.length < size)) ? 'var(--text-muted, #a0aec0)' : '#fff',
                                cursor: (totalPages != null ? page >= (totalPages - 1) : (cars.length < size)) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>  
    );
}
export default CarInventory;