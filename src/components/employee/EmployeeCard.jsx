import './styles.scss';

const EmployeeCard = ({ data = {} }) => {
    const { label, img, id, title, subtitle, team } = data;
    return (
        <div className="employee-card" >
            <div className="image">
                <img src={data.img} alt={data.id} />
            </div>
            <div className="right-section">
                <div className="title">{title}</div>
                <div className="subtitle">{subtitle}</div>
                <div className="team">{team}</div>
            </div>
        </div>
    )
}

export default EmployeeCard;