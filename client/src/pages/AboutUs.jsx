import React from 'react';
import '../css/aboutus.css';
import pen from '../Ui_Images/business-pen-set.png'
import stapler from '../Ui_Images/stapler.png'
import paper from '../Ui_Images/paper.png'
import ceo from '../Ui_Images/ceo.jpg'

const AboutUs = () => {
    return (
        <div className="about-container">
            <div className="about-first-section">
                <div className="about-first-right">
                    <div className="about-first-heading">
                        <h1 >About Us</h1>
                    </div>
                    <div className="about-first-paragraph" >
                        <p>
                            "To redefine the standard in stationery distribution by delivering
                            unmatched authenticity, quality, and service that empowers every
                            business to achieve its full potential."
                        </p>
                    </div>

                    <div className="about-first-button">
                        <button>Info</button>
                    </div>


                </div>




            </div>

            <div className="about-second-section">
                <div className="about-second-header">
                    <h1>Your Trusted Partner for Bulk Stationery Orders</h1>

                </div>

                <div className="about-second-paragraph">
                    <p>At Bashir Stationers, we specialize in fulfilling large-scale orders for the wholesale market, offering top-brand stationery products at competitive prices.
                        Our focus on bulk distribution ensures businesses receive the highest quality
                        products in the quantities they need.</p>
                </div>
                <div className="about-second-paragraph">
                    <p>With a commitment to reliability and efficiency, we make it easy for you to manage your stationery supplies,
                        no matter the size of your order.
                        Trust us to deliver excellence in every bulk order, tailored to meet your specific business needs.</p>
                </div>
            </div>


            <div className="about-third-section">
                <div className="about-third-head">
                    <div className="about-third-head-caption">
                        <p>Discover More</p>
                    </div>
                    <div className="about-third-head-middle">
                        <div className="about-third-head-middle-left">
                            <h1>Specialists</h1>
                            <h3>of Stationery</h3>
                        </div>
                        <div className="about-third-head-middle-right">
                            <p>With decades of expertise in curating the finest stationery brands,
                                we bring unmatched quality and precision to every order, ensuring your business always
                                receives the best.</p>
                        </div>
                    </div>

                </div>

                <div className="about-third-specialities">

                    <div className="about-third-speciality">
                        <div className="about-third-speciality-info">
                            <div className="about-third-speciality-info-h">
                                <h1>Pens</h1>
                            </div>
                            <div className="about-third-speciality-info-p">
                                <p>
                                    At Rasheed Stationers, our expertise in pens ranges from everyday essentials to premium writing instruments.
                                    We offer a curated selection of high-quality pens,
                                    ensuring a smooth and reliable writing experience for professionals and businesses alike.
                                </p>
                            </div>

                        </div>

                        <div className="about-third-speciality-img">
                            <img src={pen} alt="pen" />
                        </div>

                    </div>


                    <div className="about-third-speciality">
                        <div className="about-third-speciality-img">
                            <img src={stapler} alt="stapler" />
                        </div>
                        <div className="about-third-speciality-info">
                            <div className="about-third-speciality-info-h">
                                <h1>Staplers</h1>
                            </div>
                            <div className="about-third-speciality-info-p">
                                <p>
                                    Rasheed Stationers is your go-to source for durable and efficient staplers.
                                    Our range includes options designed for high-volume use,
                                    providing the reliability and performance needed to keep your office running smoothly.
                                </p>
                            </div>

                        </div>



                    </div>

                    <div className="about-third-speciality">
                        <div className="about-third-speciality-info">
                            <div className="about-third-speciality-info-h">
                                <h1>Papers</h1>
                            </div>
                            <div className="about-third-speciality-info-p">
                                <p>
                                    We specialize in providing a diverse selection of papers that cater to various needs,
                                    from standard office sheets to specialty papers. Bashir Stationers
                                    ensures that each paper product delivers exceptional quality, making it a trusted choice for businesses across Pakistan.
                                </p>
                            </div>

                        </div>

                        <div className="about-third-speciality-img">
                            <img src={paper} alt="paper" />
                        </div>

                    </div>

                </div>


            </div>


            <div className="about-fourth-section">
                <h1>Owner</h1>
                <div className="about-fourth-cards">
                    <div className="about-fourth-card-small">
                        <h1>
                            CFO
                        </h1>
                        <img src={ceo} alt="" />
                        <div className="about-fourth-card-info">
                            <h2>TALHA ABID</h2>
                            <p>Under the visionary leadership of our CEO, Rasheed Stationers continues to set the benchmark for quality
                                and innovation in the stationery industry.</p>
                        </div>
                    </div>
                    <div className="about-fourth-card-big">
                        <h1>
                            CEO
                        </h1>
                        <img src={ceo} alt="" />
                        <div className="about-fourth-card-info">
                            <h2>TALHA ABID</h2>
                            <p>Under the visionary leadership of our CEO, Rasheed Stationers continues to set the benchmark for quality
                                and innovation in the stationery industry.</p>
                        </div>
                    </div>
                    <div className="about-fourth-card-small">
                        <h1>
                            COO
                        </h1>
                        <img src={ceo} alt="" />
                        <div className="about-fourth-card-info">
                            <h2>TALHA ABID</h2>
                            <p>Under the visionary leadership of our CEO, Rasheed Stationers continues to set the benchmark for quality
                                and innovation in the stationery industry.</p>
                        </div>
                    </div>

                </div>
            </div>


        </div>
    );
};

export default AboutUs;
