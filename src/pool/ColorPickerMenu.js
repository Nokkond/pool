const ColorPickerMenu = ({ x, y, onClose, onChangeColor }) => {
    const colors = ['red', 'blue', 'green', 'yellow'];

    return (
      <div style={{ position: 'absolute', top: y, left: x, backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <div>Выберите цвет:</div>
        {colors.map((color) => <button style={{background: `${color}`, height: '20px'}} onClick={() => onChangeColor(color)}></button>)}
        <button onClick={onClose}>Закрыть</button>
      </div>
    );
};

export default ColorPickerMenu;