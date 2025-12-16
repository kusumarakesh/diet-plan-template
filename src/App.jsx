import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function App() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Early Morning', 'Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Bedtime'];

  const [client, setClient] = useState({ name: '', age: '', weight: '', height: '', goal: '', startDate: '', calories: '', allergies: '' });
  const [mealPlan, setMealPlan] = useState(() => {
    const init = {};
    days.forEach(d => { init[d] = {}; meals.forEach(m => { init[d][m] = ''; }); });
    return init;
  });
  const [supplements, setSupplements] = useState([
    { name: '', dosage: '', timing: '' },
    { name: '', dosage: '', timing: '' },
    { name: '', dosage: '', timing: '' },
    { name: '', dosage: '', timing: '' }
  ]);
  const [avoid, setAvoid] = useState('');
  const [instructions, setInstructions] = useState('');
  const [followUp, setFollowUp] = useState('');
  const contact = { phone: '+91 8919710584', email: 'jeevansri123@gmail.com' };

  const updateMeal = (day, meal, val) => setMealPlan(p => ({ ...p, [day]: { ...p[day], [meal]: val } }));
  const updateSupplement = (idx, field, val) => setSupplements(s => s.map((item, i) => i === idx ? { ...item, [field]: val } : item));

  const printContentRef = useRef(null);


  const generatePDF = async () => {
    try {
      const name = client.name || 'Client';
      const age = client.age || '-';
      const weight = client.weight || '-';
      const height = client.height || '-';
      const goal = client.goal || '-';
      const week = client.startDate || '-';
      const cal = client.calories || '-';
      const allergy = client.allergies || 'None';
      const avoidText = avoid || 'None';
      const instText = instructions || 'None';
      const followDate = followUp || 'TBD';
      const ph = contact.phone;
      const em = contact.email;

      let mealRows = '';
      meals.forEach(m => {
        mealRows += '<tr><td style="padding:6px;border:1px solid #ddd;font-weight:500">' + m + '</td>';
        days.forEach(d => {
          const val = mealPlan[d] && mealPlan[d][m] ? mealPlan[d][m] : '';
          mealRows += '<td style="padding:6px;border:1px solid #ddd">' + val + '</td>';
        });
        mealRows += '</tr>';
      });

      let suppRows = '';
      supplements.forEach(s => {
        suppRows += '<tr><td style="padding:6px;border:1px solid #ddd">' + (s.name || '') + '</td>';
        suppRows += '<td style="padding:6px;border:1px solid #ddd;text-align:center">' + (s.dosage || '') + '</td>';
        suppRows += '<td style="padding:6px;border:1px solid #ddd;text-align:center">' + (s.timing || '') + '</td></tr>';
      });

      let dayH = '';
      days.forEach(d => {
        dayH += '<th style="padding:8px;background:#ecfdf5;color:#059669">' + d + '</th>';
      });

      const htmlContent = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Diet Plan</title></head>' +
        '<body style="font-family:Arial;padding:20px;max-width:800px;margin:auto;background:white">' +
        '<div style="background:#059669;color:white;padding:20px;border-radius:10px;margin-bottom:20px">' +
        '<h1 style="margin:0;font-size:24px">Weekly Diet Plan</h1>' +
        '<p style="margin:5px 0 0;font-size:14px">Prepared by: JeevanShree - Certified Integrative Nutrition Health Coach</p></div>' +
        '<div style="background:#f5f5f5;padding:15px;border-radius:10px;margin-bottom:15px">' +
        '<h2 style="color:#059669;margin:0 0 10px;font-size:18px">Client: ' + name + '</h2>' +
        '<p style="margin:5px 0;font-size:14px">Age: ' + age + ' | Weight: ' + weight + 'kg | Height: ' + height + 'cm</p>' +
        '<p style="margin:5px 0;font-size:14px">Goal: ' + goal + ' | Calories: ' + cal + 'kcal</p>' +
        '<p style="margin:5px 0;font-size:14px">Week: ' + week + ' | Allergies: ' + allergy + '</p></div>' +
        '<div style="background:white;border:1px solid #ddd;border-radius:10px;padding:15px;margin-bottom:15px">' +
        '<h2 style="color:#059669;margin:0 0 10px;font-size:16px">Weekly Meal Plan</h2>' +
        '<table style="width:100%;border-collapse:collapse;font-size:11px">' +
        '<tr><th style="padding:8px;background:#ecfdf5;color:#059669;text-align:left">Meal</th>' + dayH + '</tr>' +
        mealRows + '</table></div>' +
        '<div style="background:white;border:1px solid #ddd;border-radius:10px;padding:15px;margin-bottom:15px">' +
        '<h2 style="color:#059669;margin:0 0 10px;font-size:16px">Supplements</h2>' +
        '<table style="width:100%;border-collapse:collapse;font-size:11px">' +
        '<tr><th style="padding:6px;background:#f3e8ff;color:#7c3aed">Name</th><th style="padding:6px;background:#f3e8ff;color:#7c3aed">Dosage</th><th style="padding:6px;background:#f3e8ff;color:#7c3aed">Timing</th></tr>' +
        suppRows + '</table></div>' +
        '<div style="background:white;border:1px solid #ddd;border-radius:10px;padding:15px;margin-bottom:15px">' +
        '<h2 style="color:#dc2626;margin:0 0 10px;font-size:16px">Foods to Avoid</h2>' +
        '<p style="margin:5px 0;font-size:12px">' + avoidText + '</p></div>' +
        '<div style="background:white;border:1px solid #ddd;border-radius:10px;padding:15px;margin-bottom:15px">' +
        '<h2 style="color:#059669;margin:0 0 10px;font-size:16px">Instructions</h2>' +
        '<p style="margin:5px 0;font-size:12px">' + instText + '</p></div>' +
        '<div style="background:#d1fae5;padding:15px;border-radius:10px;font-size:12px">' +
        '<b>Follow-up:</b> ' + followDate + ' | <b>Contact:</b> ' + ph + ' / ' + em + '</div>' +
        '</body></html>';

      // Create temporary div
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);

      // Generate canvas from HTML
      const canvas = await html2canvas(tempDiv, {
        useCORS: true,
        scale: 2,
        width: 800,
        height: tempDiv.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        backgroundColor: '#ffffff'
      });

      // Remove temp div
      document.body.removeChild(tempDiv);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save('DietPlan_' + name.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');
    } catch (e) {
      alert('PDF generation error: ' + e.message);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen font-sans">
      <div className="flex justify-end gap-3 mb-4">
        <button onClick={generatePDF} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2.5 rounded-lg shadow-md font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download PDF
        </button>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div><h1 className="text-2xl font-bold">Weekly Diet Plan</h1><p className="text-emerald-100 text-sm mt-1">Personalized Nutrition Program</p></div>
          <div className="text-right"><p className="text-sm text-emerald-100">Prepared by</p><p className="font-semibold">JeevanShree</p><p className="text-xs text-emerald-200">Certified Integrative Nutrition Health Coach</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">Client Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="text-xs text-gray-500 block mb-1">Client Name</label><input type="text" value={client.name} onChange={e => setClient({...client, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Name" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Age</label><input type="text" value={client.age} onChange={e => setClient({...client, age: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Years" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Weight (kg)</label><input type="text" value={client.weight} onChange={e => setClient({...client, weight: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="kg" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Height (cm)</label><input type="text" value={client.height} onChange={e => setClient({...client, height: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="cm" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Health Goal</label><input type="text" value={client.goal} onChange={e => setClient({...client, goal: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="e.g., Weight Loss, Muscle Building, Improved Energy" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Week Starting</label><input type="date" value={client.startDate} onChange={e => setClient({...client, startDate: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" /></div>
          <div><label className="text-xs text-gray-500 block mb-1">Daily Calories</label><input type="text" value={client.calories} onChange={e => setClient({...client, calories: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="kcal" /></div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-gray-500 block mb-1">Allergies</label>
          <input type="text" value={client.allergies} onChange={e => setClient({...client, allergies: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300" placeholder="e.g., Lactose, Gluten" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">Weekly Meal Plan</h2>
        <table className="w-full text-xs">
          <thead><tr className="bg-emerald-50"><th className="p-2 text-left text-emerald-700 font-semibold">Meal</th>{days.map(d => <th key={d} className="p-2 text-center text-emerald-700 font-semibold">{d}</th>)}</tr></thead>
          <tbody>{meals.map((meal, i) => (
            <tr key={meal} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="p-2 font-medium text-gray-700 whitespace-nowrap">{meal}</td>
              {days.map(d => <td key={d + meal} className="p-1 border border-gray-100"><textarea value={mealPlan[d][meal]} onChange={e => updateMeal(d, meal, e.target.value)} className="w-full min-h-[45px] text-xs p-1 resize-none rounded outline-none" placeholder="Food..." /></td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">Supplements</h2>
          <table className="w-full text-xs">
            <thead><tr className="bg-purple-50"><th className="p-2 text-left text-purple-700">Name</th><th className="p-2 text-center text-purple-700">Dosage</th><th className="p-2 text-center text-purple-700">Timing</th></tr></thead>
            <tbody>{supplements.map((s, i) => (
              <tr key={i}>
                <td className="p-1"><input type="text" value={s.name} onChange={e => updateSupplement(i, 'name', e.target.value)} className="w-full border border-gray-200 rounded p-1" /></td>
                <td className="p-1"><input type="text" value={s.dosage} onChange={e => updateSupplement(i, 'dosage', e.target.value)} className="w-full border border-gray-200 rounded p-1 text-center" /></td>
                <td className="p-1"><input type="text" value={s.timing} onChange={e => updateSupplement(i, 'timing', e.target.value)} className="w-full border border-gray-200 rounded p-1 text-center" /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold text-red-600 mb-4 border-b pb-2">Foods to Avoid</h2>
          <textarea value={avoid} onChange={e => setAvoid(e.target.value)} className="w-full h-32 border border-gray-200 rounded-lg p-3 text-sm resize-none" placeholder="List foods..."></textarea>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4 border-b pb-2">Special Instructions</h2>
        <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full h-20 border border-gray-200 rounded-lg p-3 text-sm resize-none" placeholder="Tips..."></textarea>
      </div>

      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div><p className="text-sm font-semibold text-emerald-800">Follow-up Date</p><input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} className="mt-1 border border-emerald-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div>
            <p className="text-xs text-emerald-600 mb-1">Contact:</p>
            <a href={`tel:${contact.phone}`} className="block text-sm font-medium text-emerald-800 hover:text-emerald-600 underline cursor-pointer">{contact.phone}</a>
            <a href={`mailto:${contact.email}`} className="block text-sm font-medium text-emerald-800 hover:text-emerald-600 underline cursor-pointer">{contact.email}</a>
          </div>
        </div>
      </div>
    </div>
  );
}