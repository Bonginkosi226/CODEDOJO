import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import telemetryService from '../services/telemetryService.js';
import { v4 as uuidv4 } from 'uuid'; // Generate session ID

const TelemetryContext = createContext(null);

export const useTelemetry = () => useContext(TelemetryContext);

export const TelemetryProvider = ({ children }) => {
  const [sessionId] = useState(() => uuidv4());
  const eventQueue = useRef([]);
  const location = useLocation();
  const flushInterval = useRef(null);

  // Core tracking function that caches events
  const track = (eventType, context, metadata = {}) => {
    const event = {
      sessionId,
      eventType,
      context,
      metadata,
      timestamp: new Date()
    };
    eventQueue.current.push(event);
  };

  // Flush queued events to backend in bulk
  const flushEvents = async () => {
    if (eventQueue.current.length === 0) return;
    
    // Copy and clear immediately to avoid race conditions
    const eventsToPush = [...eventQueue.current];
    eventQueue.current = [];

    await telemetryService.pushBulkTelemetry(eventsToPush);
  };

  // Set up recurring background flush (e.g., every 10 seconds)
  useEffect(() => {
    flushInterval.current = setInterval(() => {
      flushEvents();
    }, 10000);

    return () => {
      clearInterval(flushInterval.current);
      flushEvents(); // Final flush on unmount
    };
  }, []);

  // Track page views automatically on route changes
  useEffect(() => {
    track('page_view', location.pathname);
  }, [location.pathname]);

  // Track global clicks on elements with data-telemetry attributes
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Find closest element with data-telemetry
      const target = e.target.closest('[data-telemetry]');
      if (target) {
        track('click', location.pathname, {
          elementId: target.id || null,
          telemetryTag: target.getAttribute('data-telemetry'),
          text: target.innerText?.slice(0, 50) || null
        });
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [location.pathname]);

  return (
    <TelemetryContext.Provider value={{ track, sessionId }}>
      {children}
    </TelemetryContext.Provider>
  );
};
