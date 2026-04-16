import type { InfographicData } from '@/types/infographic'

// Clean vertical steps layout - no overlapping elements
export const DEFAULT_INFOGRAPHIC: InfographicData = {
  canvasWidth: 800,
  canvasHeight: 1100,
  background: '#ffffff',
  elements: [
    // Background
    { id: 'bg', type: 'rect', x: 0, y: 0, width: 800, height: 1100, fill: '#ffffff', rx: 0, opacity: 1, stroke: null, strokeWidth: null, zIndex: 0 },
    
    // Header band
    { id: 'header-bg', type: 'rect', x: 0, y: 0, width: 800, height: 200, fill: '#7c3aed', rx: 0, opacity: 1, stroke: null, strokeWidth: null, zIndex: 1 },
    
    // Decorative circle top right
    { id: 'deco-1', type: 'circle', x: 680, y: -40, radius: 120, fill: '#ffffff', opacity: 0.1, stroke: null, strokeWidth: null, zIndex: 2 },
    
    // Header text
    { id: 'label', type: 'text', x: 48, y: 40, text: 'STARTUP GUIDE', fontSize: 12, fontWeight: 'bold', fontFamily: 'Arial', fill: '#c4b5fd', textAlign: 'left', width: 704, opacity: 1, zIndex: 10 },
    { id: 'title-1', type: 'text', x: 48, y: 65, text: 'Launch Your SaaS', fontSize: 48, fontWeight: '900', fontFamily: 'Arial', fill: '#ffffff', textAlign: 'left', width: 704, opacity: 1, zIndex: 10 },
    { id: 'title-2', type: 'text', x: 48, y: 120, text: 'in 5 Steps', fontSize: 48, fontWeight: '900', fontFamily: 'Arial', fill: '#fbbf24', textAlign: 'left', width: 704, opacity: 1, zIndex: 10 },
    { id: 'subtitle', type: 'text', x: 48, y: 175, text: 'From idea to your first 100 paying customers', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#e9d5ff', textAlign: 'left', width: 704, opacity: 1, zIndex: 10 },

    // Step 1
    { id: 's1-accent', type: 'rect', x: 48, y: 230, width: 6, height: 130, fill: '#7c3aed', rx: 3, opacity: 1, stroke: null, strokeWidth: null, zIndex: 5 },
    { id: 's1-num', type: 'text', x: 72, y: 238, text: '01', fontSize: 36, fontWeight: '900', fontFamily: 'Arial', fill: '#7c3aed', textAlign: 'left', width: 420, opacity: 0.2, zIndex: 6 },
    { id: 's1-title', type: 'text', x: 72, y: 280, text: 'Validate Your Idea', fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', fill: '#1a1a2e', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's1-body', type: 'text', x: 72, y: 310, text: 'Talk to 20+ potential customers. Find a burning problem worth solving.', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#64748b', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's1-stat', type: 'stat', x: 620, y: 250, width: 130, height: 90, bgFill: '#f3e8ff', valueFill: '#7c3aed', labelFill: '#64748b', value: '42%', label: 'fail due to no market need', rx: 10, zIndex: 8 },

    // Step 2
    { id: 's2-accent', type: 'rect', x: 48, y: 390, width: 6, height: 130, fill: '#f97316', rx: 3, opacity: 1, stroke: null, strokeWidth: null, zIndex: 5 },
    { id: 's2-num', type: 'text', x: 72, y: 398, text: '02', fontSize: 36, fontWeight: '900', fontFamily: 'Arial', fill: '#f97316', textAlign: 'left', width: 420, opacity: 0.2, zIndex: 6 },
    { id: 's2-title', type: 'text', x: 72, y: 440, text: 'Build Your MVP', fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', fill: '#1a1a2e', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's2-body', type: 'text', x: 72, y: 470, text: 'Ship the smallest version that solves the core problem. Speed beats perfection.', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#64748b', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's2-stat', type: 'stat', x: 620, y: 410, width: 130, height: 90, bgFill: '#ffedd5', valueFill: '#f97316', labelFill: '#64748b', value: '6 wks', label: 'ideal MVP timeline', rx: 10, zIndex: 8 },

    // Step 3
    { id: 's3-accent', type: 'rect', x: 48, y: 550, width: 6, height: 130, fill: '#14b8a6', rx: 3, opacity: 1, stroke: null, strokeWidth: null, zIndex: 5 },
    { id: 's3-num', type: 'text', x: 72, y: 558, text: '03', fontSize: 36, fontWeight: '900', fontFamily: 'Arial', fill: '#14b8a6', textAlign: 'left', width: 420, opacity: 0.2, zIndex: 6 },
    { id: 's3-title', type: 'text', x: 72, y: 600, text: 'Set Your Pricing', fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', fill: '#1a1a2e', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's3-body', type: 'text', x: 72, y: 630, text: 'Price based on value delivered, not your costs. Start higher than you think.', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#64748b', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's3-stat', type: 'stat', x: 620, y: 570, width: 130, height: 90, bgFill: '#ccfbf1', valueFill: '#14b8a6', labelFill: '#64748b', value: '3x', label: 'value vs perceived cost', rx: 10, zIndex: 8 },

    // Step 4
    { id: 's4-accent', type: 'rect', x: 48, y: 710, width: 6, height: 130, fill: '#ec4899', rx: 3, opacity: 1, stroke: null, strokeWidth: null, zIndex: 5 },
    { id: 's4-num', type: 'text', x: 72, y: 718, text: '04', fontSize: 36, fontWeight: '900', fontFamily: 'Arial', fill: '#ec4899', textAlign: 'left', width: 420, opacity: 0.2, zIndex: 6 },
    { id: 's4-title', type: 'text', x: 72, y: 760, text: 'Acquire Customers', fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', fill: '#1a1a2e', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's4-body', type: 'text', x: 72, y: 790, text: 'Focus on 1-2 channels max. Build in public on Twitter and LinkedIn.', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#64748b', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's4-stat', type: 'stat', x: 620, y: 730, width: 130, height: 90, bgFill: '#fce7f3', valueFill: '#ec4899', labelFill: '#64748b', value: '100', label: 'first customer goal', rx: 10, zIndex: 8 },

    // Step 5
    { id: 's5-accent', type: 'rect', x: 48, y: 870, width: 6, height: 130, fill: '#6366f1', rx: 3, opacity: 1, stroke: null, strokeWidth: null, zIndex: 5 },
    { id: 's5-num', type: 'text', x: 72, y: 878, text: '05', fontSize: 36, fontWeight: '900', fontFamily: 'Arial', fill: '#6366f1', textAlign: 'left', width: 420, opacity: 0.2, zIndex: 6 },
    { id: 's5-title', type: 'text', x: 72, y: 920, text: 'Retain & Grow', fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', fill: '#1a1a2e', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's5-body', type: 'text', x: 72, y: 950, text: 'Onboard users with quick wins. Send weekly value emails to reduce churn.', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#64748b', textAlign: 'left', width: 420, opacity: 1, zIndex: 10 },
    { id: 's5-stat', type: 'stat', x: 620, y: 890, width: 130, height: 90, bgFill: '#e0e7ff', valueFill: '#6366f1', labelFill: '#64748b', value: '<5%', label: 'monthly churn target', rx: 10, zIndex: 8 },

    // Footer
    { id: 'footer-bg', type: 'rect', x: 0, y: 1030, width: 800, height: 70, fill: '#1a1a2e', rx: 0, opacity: 1, stroke: null, strokeWidth: null, zIndex: 3 },
    { id: 'footer-text', type: 'text', x: 48, y: 1058, text: 'Start building today. Your first 100 customers are waiting.', fontSize: 14, fontWeight: 'normal', fontFamily: 'Arial', fill: '#ffffff', textAlign: 'left', width: 560, opacity: 1, zIndex: 10 },
    { id: 'footer-brand', type: 'text', x: 620, y: 1060, text: 'Made with AI Infographics Generator', fontSize: 11, fontWeight: 'normal', fontFamily: 'Arial', fill: '#64748b', textAlign: 'left', width: 172, opacity: 1, zIndex: 10 },
  ],
}
