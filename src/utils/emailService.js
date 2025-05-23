const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendCartTicketConfirmation = async (userEmail, cartItem, performance) => {
    try {
        const seatsText = cartItem.seats
            .map(seat => `Ряд ${seat.row}, Місце ${seat.seat}`)
            .join('\n');

        const date = new Date(performance.date);
        const formattedDate = new Intl.DateTimeFormat('uk-UA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        const totalPrice = performance.ticketPrice * cartItem.seats.length;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Квитки на виставу "${performance.title}" додано в корзину`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #8B0000; text-align: center;">Квитки додано в корзину</h1>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="color: #333;">${performance.title}</h2>
                        
                        <div style="margin: 15px 0;">
                            <p style="margin: 5px 0;"><strong>Дата:</strong> ${formattedDate}</p>
                            <p style="margin: 5px 0;"><strong>Час:</strong> ${performance.time}</p>
                            <p style="margin: 5px 0;"><strong>Місце проведення:</strong> ${performance.venue}</p>
                        </div>

                        <div style="margin: 15px 0;">
                            <h3 style="color: #333;">Інформація про вибрані місця:</h3>
                            <p style="margin: 5px 0;"><strong>Кількість квитків:</strong> ${cartItem.seats.length}</p>
                            <p style="margin: 5px 0;"><strong>Загальна вартість:</strong> ${totalPrice} грн</p>
                        </div>

                        <div style="margin: 15px 0;">
                            <h3 style="color: #333;">Ваші місця:</h3>
                            <div style="background-color: white; padding: 10px; border-radius: 4px;">
                                ${seatsText.split('\n').map(seat => 
                                    `<p style="margin: 5px 0;">${seat}</p>`
                                ).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            <strong>Важливо:</strong> Ці місця зарезервовано для вас. 
                            Будь ласка, завершіть оформлення замовлення протягом 15 хвилин.
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 20px; color: #666;">
                        <p>З повагою,<br>Команда Оперного театру</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending cart confirmation email:', error);
        throw error;
    }
};

exports.sendTicketConfirmation = async (userEmail, ticket, performance) => {
    try {
        const seatsText = ticket.seats
            .map(seat => `Ряд ${seat.row}, Місце ${seat.seat}`)
            .join('\n');

        const date = new Date(performance.date);
        const formattedDate = new Intl.DateTimeFormat('uk-UA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Квитки на виставу "${performance.title}"`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #8B0000; text-align: center;">Ваші квитки</h1>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h2 style="color: #333;">${performance.title}</h2>
                        
                        <div style="margin: 15px 0;">
                            <p style="margin: 5px 0;"><strong>Дата:</strong> ${formattedDate}</p>
                            <p style="margin: 5px 0;"><strong>Час:</strong> ${performance.time}</p>
                            <p style="margin: 5px 0;"><strong>Місце проведення:</strong> ${performance.venue}</p>
                        </div>

                        <div style="margin: 15px 0;">
                            <h3 style="color: #333;">Інформація про бронювання:</h3>
                            <p style="margin: 5px 0;"><strong>На ім'я:</strong> ${ticket.fullName}</p>
                            <p style="margin: 5px 0;"><strong>Кількість квитків:</strong> ${ticket.quantity}</p>
                            <p style="margin: 5px 0;"><strong>Загальна вартість:</strong> ${ticket.totalPrice} грн</p>
                        </div>

                        <div style="margin: 15px 0;">
                            <h3 style="color: #333;">Ваші місця:</h3>
                            <div style="background-color: white; padding: 10px; border-radius: 4px;">
                                ${seatsText.split('\n').map(seat => 
                                    `<p style="margin: 5px 0;">${seat}</p>`
                                ).join('')}
                            </div>
                        </div>
                    </div>

                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <p style="margin: 0; color: #856404;">
                            <strong>Важливо:</strong> Будь ласка, збережіть цей квиток. 
                            Покажіть його при отриманні квитків у касі театру.
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 20px; color: #666;">
                        <p>З повагою,<br>Команда Оперного театру</p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};