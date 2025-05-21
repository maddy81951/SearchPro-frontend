import React, { useState, useCallback } from 'react';
import { dummyData } from '../data/dummyData';
import { LRUCache } from '../utils/LRUCache';
import debounce from 'lodash.debounce';

const cache = new LRUCache(10);

const SearchInput = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const filterData = useCallback(
    debounce((text) => {
      const cached = cache.get(text);
      if (cached) {
        setResults(cached.slice(0, 10)); 
      } else {
        const filtered = dummyData
          .filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase())
          )
          .slice(0, 10); 
        cache.set(text, filtered);
        setResults(filtered);
      }
    }, 300),
    []
  );

  const handleChange = (e) => {
    const text = e.target.value;
    setInput(text);
    if (text.trim() !== '') {
      filterData(text);
    } else {
      setResults([]);
    }
  };

  const clearInput = () => {
    setInput('');
    setResults([]);
  };

  const highlightMatch = (name) => {
    const index = name.toLowerCase().indexOf(input.toLowerCase());
    if (index === -1) return name;

    const before = name.slice(0, index);
    const match = name.slice(index, index + input.length);
    const after = name.slice(index + input.length);

    return (
      <>
        {before}
        <strong>{match}</strong>
        {after}
      </>
    );
  };

  return (
    <div className="search-container" style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      backgroundColor: '#222',
      margin: 0,
      paddingTop: '60px',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#4a88e5',
        marginBottom: '25px',
        fontSize: '2.5rem'
      }}>SearchPro</h1>

      <div style={{
        position: 'relative',
        width: '600px',
        maxWidth: '90%',
      }}>
        <input
          type="text"
          placeholder="Search..."
          value={input}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '10px 35px 10px 40px',
            borderRadius: '20px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '16px'
          }}
        />
        <span style={{
          position: 'absolute',
          left: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#666'
        }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {input && (
          <button
            onClick={clearInput}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div style={{
          width: '600px',
          maxWidth: '90%',
          border: '1px solid #444',
          marginTop: '10px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          background: '#333',
          maxHeight: '350px',
          overflowY: 'auto'
        }}>
          {results.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '10px 15px',
                borderBottom: '1px solid #444',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#eee'
              }}
            >
              <span style={{ color: '#666' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <span style={{ color: '#4a88e5' }}>
                {highlightMatch(item.name)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;